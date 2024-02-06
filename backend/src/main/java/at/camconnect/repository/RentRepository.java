package at.camconnect.repository;

import at.camconnect.dtos.RentDTO;
import at.camconnect.dtos.RentByStudentDTO;
import at.camconnect.enums.RentStatusEnum;
import at.camconnect.responseSystem.CCException;
import at.camconnect.socket.RentSocket;
import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import at.camconnect.responseSystem.CCResponse;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Inject
    MailClient client;

    @Inject
    RentSocket rentSocket;

    @Transactional
    public void create(RentDTO rentData){
        Rent rent = new Rent(em.find(Student.class, rentData.student_id()));
        em.persist(rent);
        rentSocket.broadcast(getAll());
    }

    @Transactional
    public void createEmpty(){
        em.persist(new Rent());
        rentSocket.broadcast(getAll());
    }

    @Transactional
    public Response remove(Long id){
        try {
            em.remove(em.find(Rent.class, id));
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        rentSocket.broadcast(getAll());
        return CCResponse.ok();
    }

    public List<Rent> getAllSingleList(){
        return em.createQuery("SELECT r FROM Rent r", Rent.class).getResultList();
    }

    public List<RentByStudentDTO> getAll(){
        List<Student> students = em.createQuery(
                "SELECT s FROM Rent r" +
                    " join Student s on r.student.student_id = s.student_id" +
                        " group by s.student_id", Student.class).getResultList();

        List<RentByStudentDTO> result = new LinkedList<>();

        for (Student student : students) {
            List<Rent> rents = em.createQuery(
                    "SELECT r FROM Rent r" +
                            " where r.student.student_id = ?1", Rent.class).setParameter(1, student.getStudent_id()).getResultList();

            result.add(new RentByStudentDTO(student, rents));
        }
        return result;
    }

    public Rent getById(Long id){
        Rent result = em.find(Rent.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }

    @Transactional
    public MailClient sendConfirmation(Long id){
        Rent rent = getById(id);
        if(rent.getStatus().equals(RentStatusEnum.WAITING)){
            throw new CCException(1205, "Email is already send");
        }

        MailMessage message = generateConfirmationMailMessage(id);
        System.out.println(message.toJson());

        rent.setStatus(RentStatusEnum.WAITING);
        em.merge(rent);

        return client.sendMail(message, result -> {
            if (result.succeeded()) {
                System.out.println("Email sent successfully");
            } else {
                System.out.println("Failed to send email: " + result.cause());
                throw new CCException(1200, "Failed to send mail");
            }
        });
    }

    @Transactional
    public MailMessage generateConfirmationMailMessage(Long id) {
        String FRONTEND_URL = "http://144.24.171.164/public/";

        String os = System.getProperty("os.name").toLowerCase();

        if (os.contains("win")) {
            FRONTEND_URL = "http://localhost:3000";
        }

        Rent rent = getById(id);

        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        String email = rent.getStudent().getEmail();
        message.setTo(email);
        message.setSubject("Bestätigung des Geräteverleih");

        String verification_code = rent.generateVerification_code();
        em.merge(rent);

        String urlDecline = FRONTEND_URL + "/confirmVerification.html?vcode=" + verification_code + "&id=" + id;
        String urlAccept = urlDecline + "&isAccepted=true";

        //plaintext is als backup für den html content, wenn html möglich ist wird nur das angezeigt
        message.setHtml("Bitte bestätige oder lehne deinen Verleih ab:<br>" +
                "<p>" + rent.getDevice_string() + " mit Zubehör: " + rent.getAccessory() + " von: " + rent.getRent_start() + " bis: " + rent.getRent_end_planned() + "</p>" +
                 "<div><a style='margin: 2rem; padding: .5rem 1rem; color: black;' href='" + urlAccept + "'>Bestätigen</a>" +
                "<a style='margin: 2rem; padding: .5rem 1rem; color: black;' href='" + urlDecline + "'>Ablehnen</a></div>");

        return message;
    }

    @Transactional
    public void confirm(Long rentId, RentDTO rentDTO) {
        Rent rent = getById(rentId);

        if(!rent.getStatus().equals(RentStatusEnum.WAITING) && !rent.getStatus().equals(RentStatusEnum.CONFIRMED)){
            throw new CCException(1205);
        }

        String verificationCode;
        String verificationMessage;
        RentStatusEnum verificationStatus;

        try{
            verificationCode = rentDTO.verification_code();
            verificationMessage = rentDTO.verification_message();
            verificationStatus = rentDTO.status();
        } catch (IllegalArgumentException e) {
            throw new CCException(1106);
        }

        Set<RentStatusEnum> allowedStatus = Set.of(RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED, RentStatusEnum.RETURNED);
        // set only if the current status is allowed and if the verification_code is the same as provided
        if (allowedStatus.contains(verificationStatus) && rent.getVerification_code().equals(verificationCode)) {
            rent.setStatus(verificationStatus);
            rent.setVerification_message(verificationMessage);
            em.merge(rent);
        } else{
            throw new CCException(1205, "Message: " + verificationMessage + ", Status: " + verificationStatus + ", Code: " + verificationCode);
        }
    }

    @Transactional
    public void returnRent(Long rentId, RentDTO rentDTO){
        Rent rent = getById(rentId);

        //instant return if already confirmed
        if(!rent.getStatus().equals(RentStatusEnum.CONFIRMED)){
            throw new CCException(1205);
        }

        rent.setStatus(RentStatusEnum.RETURNED);
        em.merge(rent);

        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        String email = rent.getStudent().getEmail();
        message.setTo(email);
        message.setSubject("Bestätigung der Gerät Rückgabe");
        //plaintext is als backup für den html content, wenn html möglich ist wird nur das angezeigt
        message.setHtml("Ihr Verleih von " + rent.getDevice_string() + " vom: " + rent.getRent_start() + " bis: " + rent.getRent_end_actual() + ", wurde zurückgegeben.");


        client.sendMail(message, result -> {
            if (result.succeeded()) {
                System.out.println("Email sent successfully");
            } else {
                System.out.println("Failed to send email: " + result.cause());
                throw new CCException(1200, "Failed to send mail");
            }
        });

        rentSocket.broadcast(getAll());
    }

    @Transactional
    public void update(Long id, JsonObject rentJson){
        if(rentJson == null) throw new CCException(1105);

        if(validateJsonKey(rentJson,"student_id"))
            try{ setStudent(id, rentJson.getInt("student_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update student_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_start_id"))
            try{ setTeacherStart(id, rentJson.getInt("teacher_start_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update teacher_start_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_end_id"))
            try{ setTeacherEnd(id, rentJson.getInt("teacher_end_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update teacher_end_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_id"))
            try{ setDevice(id, rentJson.getInt("device_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update device_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_start"))
            try{ setRentStart(id, rentJson.getString("rent_start")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_start " + ex.getMessage()); }

        if(validateJsonKey(rentJson, "rent_end_planned"))
            try{ setRentEndPlanned(id, rentJson.getString("rent_end_planned")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_planned " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_end_actual"))
            try{ setRentEndActual(id, rentJson.getString("rent_end_actual"));}
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_actual " + ex.getMessage()); }


        if(validateJsonKey(rentJson,"status"))
            try{ confirm(id, rentJson.getString("status")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update status " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"note"))
            try{ setNote(id, rentJson.getString("note")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update note " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"accessory"))
            try{ setAccessory(id, rentJson.getString("accessory")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update accessory " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_string"))
            try{ setDeviceString(id, rentJson.getString("device_string")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update device_string " + ex.getMessage()); }

        rentSocket.broadcast(getAll());
    }

    @Transactional
    public void updateAttribute(String attribute, Long rentId, RentDTO rentDTO){
        Rent rent = em.find(Rent.class, rentId);

        switch (attribute){
            case "student":
                Student student = em.find(Student.class, rentDTO.student_id());
                rent.setStudent(student);
                break;
            case "device":
                Device device = em.find(Device.class, rentDTO.device_id());
                rent.setDevice(device);
                break;
            case "teacherstart":
                Teacher teacherStart = em.find(Teacher.class, rentDTO.teacher_id_start());
                rent.setTeacher_start(teacherStart);
                break;
            case "teacherend":
                Teacher teacherEnd = em.find(Teacher.class, rentDTO.teacher_id_end());
                rent.setTeacher_end(teacherEnd);
                break;
            case "rentstart":
                LocalDate rentStart = rentDTO.rent_start();
                rent.setRent_start(rentStart);
                break;
            case "rentendplanned":
                LocalDate rentEndPlanned = rentDTO.rent_end_planned();
                rent.setRent_end_planned(rentEndPlanned);
                break;
            case "rentendactual":
                LocalDate rentEndActual = rentDTO.rent_end_actual();
                rent.setRent_end_actual(rentEndActual);
                break;
            case "note":
                rent.setNote(rentDTO.note());
                break;
            case "status":
                RentStatusEnum status = rentDTO.status();
                rent.setStatus(status);
                break;
        }

        rentSocket.broadcast(getAll());
    }

    //region setter
    public void setStudent(Long rentId, long studentId) {
        Student student = em.find(Student.class, studentId);
        Rent rent = getById(rentId);
        rent.setStudent(student);
    }

    public void setTeacherStart(Long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_start(teacher);
    }

    public void setTeacherEnd(Long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_end(teacher);
    }

    public void setDevice(Long rentId, long deviceId) {
        Device device = em.find(Device.class, deviceId);
        Rent rent = getById(rentId);
        rent.setDevice(device);
    }

    public void setRentStart(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_start(LocalDate.parse(date));
    }

    public void setRentEndPlanned(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_planned(LocalDate.parse(date));
    }

    public void setRentEndActual(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_actual(LocalDate.parse(date));
    }

    public void confirm(Long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setStatus(RentStatusEnum.valueOf(status));
    }

    public void setNote(Long rentId, String note) {
        Rent rent = getById(rentId);
        rent.setNote(note);
    }

    public void setAccessory(Long rentId, String accessory) {
        Rent rent = getById(rentId);
        rent.setAccessory(accessory);
    }
    public void setDeviceString(Long rentId, String device_string) {
        Rent rent = getById(rentId);
        rent.setDevice_string(device_string);
    }
    public void confirm(Long rentId, RentStatusEnum verificationStatus){
        Rent rent = getById(rentId);

        if(rent.getStatus() == verificationStatus){
            throw new CCException(1201);
        }

        rent.setStatus(verificationStatus);
    }
    //endregion

    //region utility
    private boolean validateJsonKey(JsonObject jsonObject, String key){
        return (jsonObject.containsKey(key) && jsonObject.get(key) != null && jsonObject.get(key) != JsonValue.NULL);
    }
    //endregion
}

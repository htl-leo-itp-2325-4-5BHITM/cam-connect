package at.camconnect.repository;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.errorSystem.CCException;
import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Inject
    MailClient client;

    @Transactional
    public void create(JsonObject rentJson){
        Rent rent = new Rent(em.find(Student.class, rentJson.getInt("student_id")));
        em.persist(rent);
    }

    @Transactional
    public void createEmpty(){
        em.persist(new Rent());
    }

    @Transactional
    public void remove(Long id){
        em.remove(em.find(Rent.class, id));
    }

    public List<Rent> getAll(){
        List<Rent> rents = em.createQuery("SELECT r FROM Rent r", Rent.class).getResultList();
        return rents;
    }

    public Rent getById(Long id){
        Rent result = em.find(Rent.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }

    public void sendConfirmation(Long id, String username){
        client.sendMail(generateMailMessage(id, username));
        setVerificationStatus(id, RentStatusEnum.WAITING);
    }

    public MailMessage generateMailMessage(Long rentId, String username) {
        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        message.setTo(username + "@students.htl-leonding.ac.at");
        message.setText("Bitte bestätige den Verleih # in dem sie auf den Link klicken: ");
        String verification_code = getById(rentId).generateVerification_code();
        message.setHtml("<a href='localhost:4200?verification_code=" + verification_code + "'>Bestätigen</a>");

        return message;
    }

    public void setConfirmationStatus (Long rentId, RentStatusEnum rentStatus, String verificationCode, String verificationMessage) {
        Rent rent = getById(rentId);

        Set<RentStatusEnum> notAllowedStatus = Set.of(RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED, RentStatusEnum.RETURNED);

        // set only if the current status is allowed and if the verification_code is the same as provided
        if (!notAllowedStatus.contains(rent.getVerification_status()) && rent.getVerification_code().equals(verificationCode)) {
            rent.setVerification_status(rentStatus);
        } else{
            throw new CCException(1205);
        }
    }


    @Transactional
    public void update(Long id, JsonObject rentJson){
        if(rentJson == null) throw new CCException(1105);

        if(validateJsonKey(rentJson,"student_id")) try{
            setStudent(id, rentJson.getInt("student_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update student_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_start_id")) try{
            setTeacherStart(id, rentJson.getInt("teacher_start_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update teacher_start_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_end_id")) try{
            setTeacherEnd(id, rentJson.getInt("teacher_end_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update teacher_end_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_id")) try{
            setDevice(id, rentJson.getInt("device_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update device_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_start")) try{
            setRentStart(id, rentJson.getString("rent_start"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_start " + ex.getMessage()); }

        if(validateJsonKey(rentJson, "rent_end_planned")) try{
            setRentEndPlanned(id, rentJson.getString("rent_end_planned"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_planned " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_end_actual")) try{
            setRentEndActual(id, rentJson.getString("rent_end_actual"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_actual " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"status")) try{
            setStatus(id, rentJson.getString("status"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update status " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"note")) try{
            setNote(id, rentJson.getString("note"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update note " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"accessory")) try{
            setAccessory(id, rentJson.getString("accessory"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update accessory " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_string")) try{
            setDeviceString(id, rentJson.getString("device_string"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update device_string " + ex.getMessage()); }
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

    public void setStatus(Long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setVerification_status(RentStatusEnum.valueOf(status));
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
    public void setVerificationStatus(Long rentId, RentStatusEnum verificationStatus){
        Rent rent = getById(rentId);

        if(rent.getVerification_status() == verificationStatus){
            throw new CCException(1201);
        }

        rent.setVerification_status(verificationStatus);
    }
    public void setVerificationCode(Long rentId, String verification_code){
        Rent rent = getById(rentId);
    }
    //endregion

    //region utility
    private boolean validateJsonKey(JsonObject jsonObject, String key){
        return (jsonObject.containsKey(key) && jsonObject.get(key) != null && jsonObject.get(key) != JsonValue.NULL);
    }
    //endregion
}

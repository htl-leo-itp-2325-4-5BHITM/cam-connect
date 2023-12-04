package at.camconnect.repository;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.errorSystem.CCException;
import at.camconnect.errorSystem.CCResponse;
import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import io.vertx.ext.mail.MailMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.Set;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

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

    public Rent getById(long id){
        Rent result = em.find(Rent.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }


    public MailMessage getMailMessage (long rentId, String itUser) {
        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        message.setTo(itUser + "@students.htl-leonding.ac.at");
        message.setText("Bitte bestätige den Verleih # in dem sie auf den Link klicken: ");
        message.setHtml("<a href='localhost:4200?verification_code=" + generateVerificationCode(rentId) + "'>Bestätigen</a>");

        return message;
    }
    public String generateVerificationCode(long rentId) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            sb.append(randomChar);
        }

        // the verification code is set to current rent
        Rent rent = getById(rentId);
        rent.setVerification_code(sb.toString());

        return sb.toString();
    }

    public void setConfirmationStatus (long rentId, RentStatusEnum rentStatus, String verificationCode, String verificationMessage) {
        Rent rent = getById(rentId);

        Set<RentStatusEnum> notAllowedStatus = Set.of(RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED, RentStatusEnum.RETURNED);

        // set only if the not allowed status' aren't the current status and if the verification is the same as provided
        if (!notAllowedStatus.contains(rent.getVerification_status()) && rent.getVerification_code().equals(verificationCode)) {
            rent.setVerification_status(rentStatus);
        } else{
            throw new CCException(1001);
        }
    }


    @Transactional
    public void update(long id, JsonObject rentJson){
        if(rentJson == null) throw new CCException(1105);

        if(rentJson.containsKey("student_id"))
        try{
            setStudent(id, rentJson.getInt("student_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update student_id " + ex.getMessage()); }

        if(rentJson.containsKey("teacher_start_id"))
        try{
            setTeacherStart(id, rentJson.getInt("teacher_start_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update teacher_start_id " + ex.getMessage()); }

        if(rentJson.containsKey("teacher_end_id"))
        try{
            setTeacherEnd(id, rentJson.getInt("teacher_end_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update teacher_end_id " + ex.getMessage()); }

        if(rentJson.containsKey("device_id"))
        try{
            setDevice(id, rentJson.getInt("device_id"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update device_id " + ex.getMessage()); }

        if(rentJson.containsKey("rent_start"))
        try{
            setRentStart(id, rentJson.getString("rent_start"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_start " + ex.getMessage()); }

        if(rentJson.containsKey("rent_end_planned"))
        try{
            setRentEndPlanned(id, rentJson.getString("rent_end_planned"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_planned " + ex.getMessage()); }

        if(rentJson.containsKey("rent_end_actual"))
        try{
            setRentEndActual(id, rentJson.getString("rent_end_actual"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_actual " + ex.getMessage()); }

        if(rentJson.containsKey("status"))
        try{
            setStatus(id, rentJson.getString("status"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update status " + ex.getMessage()); }

        if(rentJson.containsKey("note"))
        try{
            setNote(id, rentJson.getString("note"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update note " + ex.getMessage()); }

        if(rentJson.containsKey("accessory"))
        try{
            setAccessory(id, rentJson.getString("accessory"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update accessory " + ex.getMessage()); }

        if(rentJson.containsKey("device_string"))
        try{
            setDeviceString(id, rentJson.getString("device_string"));
        } catch(Exception ex){ throw new CCException(1105, "cannot update device_string " + ex.getMessage()); }
    }

    // Setter
    //region
    public void setStudent(long rentId, long studentId) {
        Student student = em.find(Student.class, studentId);
        Rent rent = getById(rentId);
        rent.setStudent(student);
    }

    public void setTeacherStart(long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_start(teacher);
    }

    public void setTeacherEnd(long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_end(teacher);
    }

    public void setDevice(long rentId, long deviceId) {
        Device device = em.find(Device.class, deviceId);
        Rent rent = getById(rentId);
        rent.setDevice(device);
    }

    public void setRentStart(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_start(LocalDate.parse(date));
    }

    public void setRentEndPlanned(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_planned(LocalDate.parse(date));
    }

    public void setRentEndActual(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_actual(LocalDate.parse(date));
    }

    public void setStatus(long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setVerification_status(RentStatusEnum.valueOf(status));
    }

    public void setNote(long rentId, String note) {
        Rent rent = getById(rentId);
        rent.setNote(note);
    }

    public void setAccessory(long rentId, String accessory) {
        Rent rent = getById(rentId);
        rent.setAccessory(accessory);
    }
    public void setDeviceString(long rentId, String device_string) {
        Rent rent = getById(rentId);
        rent.setDevice_string(device_string);
    }
    public void setVerificationMessage(long rentId, RentStatusEnum verification){
        Rent rent = getById(rentId);

        if(rent.getVerification_status() == RentStatusEnum.WAITING){
            throw new CCException(1201);
        }
        rent.setVerification_status(verification);
    }
    public void setVerificationCode(long rentId, String verification_code){
        Rent rent = getById(rentId);
    }
    //endregion
}

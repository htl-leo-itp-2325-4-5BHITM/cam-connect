package at.camconnect.repository;

import at.camconnect.Enums.RentStatus;
import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import java.sql.Date;
import java.sql.SQLOutput;
import java.time.LocalDate;
import java.util.List;

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
    public void remove(Rent rent){
        em.remove(rent);
    }

    //TODO fix this fuckery
    @Transactional
    public void update(JsonObject rent){
        Student student = null;
        if(rent.getInt("student_id") != 0)
            student = em.find(Student.class, "student_id");

        System.out.println(rent.getInt("teacher_id"));
        Teacher teacher = em.find(Teacher.class, "teacher_id");
        Device device = null;
        //TODO once demo devices exist
        //device = getDeviceById(rent.getInt("device_id"));

        String rent_start = "";
        String rent_end_planned = "";
        String rent_end_actual = "";
        String note = "";

        Rent updatedRent = em.find(Rent.class, rent.getInt("rent_id"));
        try{
            rent_start = rent.getString("rent_start");
            rent_end_planned = rent.getString("rent_end_planned");
            rent_end_actual = rent.getString("rent_end_actual");
            note = rent.getString("note");
        } catch(Exception ex) {}

        updatedRent.update(student, device, teacher, LocalDate.parse(rent_start), LocalDate.parse(rent_end_planned), LocalDate.parse(rent_end_actual), null, note);
        em.merge(updatedRent);
    }

    public List<Rent> getAll(){
        List<Rent> rents = em.createQuery("SELECT r FROM Rent r", Rent.class).getResultList();
        return rents;
    }

    public Rent getById(long id){
        return em.find(Rent.class, id);
    }


    // Getter & Setter
    //region
    public void setStudent(long rentId, long studentId) {
        Student student = em.find(Student.class, studentId);
        Rent rent = getById(rentId);
        rent.setStudent(student);
        em.merge(rent);
    }
    public Student getStudent(long rentId) {
        return getById(rentId).getStudent();
    }

    public void setTeacher(long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher(teacher);
        em.merge(rent);
    }
    public Teacher getTeacher(long rentId) {
        return getById(rentId).getTeacher();
    }

    public void setDevice(long rentId, long deviceId) {
        Device device = em.find(Device.class, deviceId);
        Rent rent = getById(rentId);
        rent.setDevice(device);
        em.merge(rent);
    }
    public Device getDevice(long rentId) {
        return getById(rentId).getDevice();
    }

    public void setRentStart(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_start(LocalDate.parse(date));
        em.merge(rent);
    }
    public String getRentStart(long rentId) {
        return getById(rentId).getRent_start().toString();
    }
    public void setRentEndPlanned(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_planned(LocalDate.parse(date));
        em.merge(rent);
    }
    public String getRentEndPlanned(long rentId) {
        return getById(rentId).getRent_end_planned().toString();
    }

    public void setRentEndActual(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_actual(LocalDate.parse(date));
        em.merge(rent);
    }
    public String getRentEndActual(long rentId) {
        return getById(rentId).getRent_end_actual().toString();
    }

    public void setStatus(long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setStatus(RentStatus.valueOf(status));
        em.merge(rent);
    }
    public String getStatus(long rentId) {
        return getById(rentId).getStatus().toString();
    }

    public void setNote(long rentId, String note) {
        Rent rent = getById(rentId);
        rent.setNote(note);
        em.merge(rent);
    }
    public String getNote(long rentId) {
        return getById(rentId).getNote();
    }
    //endregion
}

package at.camconnect.repository;

import at.camconnect.enums.RentStatus;
import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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

    @Transactional
    public void update(long id, JsonObject rentJson){
        try{
            setStudent(id, rentJson.getInt("student_id"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setTeacherStart(id, rentJson.getInt("teacher_start_id"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setTeacherEnd(id, rentJson.getInt("teacher_end_id"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setDevice(id, rentJson.getInt("device_id"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setRentStart(id, rentJson.getString("rent_start"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setRentEndPlanned(id, rentJson.getString("rent_end_planned"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setRentEndActual(id, rentJson.getString("rent_end_actual"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setStatus(id, rentJson.getString("status"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setNote(id, rentJson.getString("note"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }
    }

    public List<Rent> getAll(){
        List<Rent> rents = em.createQuery("SELECT r FROM Rent r", Rent.class).getResultList();
        return rents;
    }

    public Rent getById(long id){
        return em.find(Rent.class, id);
    }


    // Setter
    //region
    public void setStudent(long rentId, long studentId) {
        Student student = em.find(Student.class, studentId);
        Rent rent = getById(rentId);
        rent.setStudent(student);
        em.merge(rent);
    }

    public void setTeacherStart(long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_start(teacher);
        em.merge(rent);
    }

    public void setTeacherEnd(long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_end(teacher);
        em.merge(rent);
    }

    public void setDevice(long rentId, long deviceId) {
        Device device = em.find(Device.class, deviceId);
        Rent rent = getById(rentId);
        rent.setDevice(device);
        em.merge(rent);
    }

    public void setRentStart(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_start(LocalDate.parse(date));
        em.merge(rent);
    }

    public void setRentEndPlanned(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_planned(LocalDate.parse(date));
        em.merge(rent);
    }

    public void setRentEndActual(long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_actual(LocalDate.parse(date));
        em.merge(rent);
    }

    public void setStatus(long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setStatus(RentStatus.valueOf(status));
        em.merge(rent);
    }

    public void setNote(long rentId, String note) {
        Rent rent = getById(rentId);
        rent.setNote(note);
        em.merge(rent);
    }
    //endregion
}

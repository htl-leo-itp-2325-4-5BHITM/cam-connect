package at.camconnect.repository;

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
import java.util.List;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(JsonObject rent){
        Rent rent1 = new Rent(em.find(Student.class, rent.getInt("student_id")),
                rent.getString("rent_start"),
                rent.getString("rent_end_planned"),
                rent.getString("rent_end_actual"));
        em.persist(rent1);
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
    public void update(JsonObject rent){
        Student student = getStudentById(rent.getInt("student_id"));
        System.out.println(rent.getInt("teacher_id"));
        Teacher teacher = getTeacherById(rent.getInt("teacher_id"));
        Device device = getDeviceById(rent.getInt("device_id"));

        Rent rent1 = em.find(Rent.class, rent.getInt("rent_id"));
        try{
            rent1.setStudent(student);
            rent1.setTeacher(teacher);
            rent1.setDevice(device);
            rent1.setNotes(rent.getString("note"));
            rent1.setRent_start(rent.getString("rent_start"));
            rent1.setRent_end_actual(rent.getString("rent_end_actual"));
            rent1.setRent_end_planned(rent.getString("rent_end_planned"));
        } catch(Exception ex) {

        }

        em.merge(rent1);
    }

    public List<Rent> getAll(){
        Query q = em.createNativeQuery("SELECT rent_id, student_id, device_id, teacher_id, rent_start, rent_end_planned, rent_end_actual, notes FROM Rent");
        List<Rent> results = q.getResultList();
        return results;
    }

    public Rent getById(long id){
        return em.find(Rent.class, id);
    }


    public Student getStudentById(int student_id){
        return em.find(Student.class, student_id);
    }
    public Teacher getTeacherById(int teacher_id){
        return em.find(Teacher.class, teacher_id);
    }
    public Device getDeviceById(int device_id){
        return em.find(Device.class, device_id);
    }

}

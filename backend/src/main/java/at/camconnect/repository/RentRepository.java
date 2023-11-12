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

    //TODO fix this fuckery
    @Transactional
    public void update(JsonObject rent){
        Student student = null;
        if(rent.getInt("student_id") != 0)
            student = getStudentById(rent.getInt("student_id"));

        System.out.println(rent.getInt("teacher_id"));
        Teacher teacher = getTeacherById(rent.getInt("teacher_id"));
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

        updatedRent.update(student, device, teacher, rent_start, rent_end_planned, rent_end_actual, note);
        em.merge(updatedRent);
    }

    public List<Rent> getAll(){
        List<Rent> rents = em.createQuery("SELECT r FROM Rent r", Rent.class).getResultList();
        return rents;
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

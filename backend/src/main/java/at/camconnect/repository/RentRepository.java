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
import java.util.List;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(JsonObject rent){
        em.persist(new Rent(em.find(Student.class, rent.getString("student_id"))));
    }

    @Transactional
    public void remove(Rent rent){
        em.remove(rent);
    }

    @Transactional
    public void update(JsonObject rent){
        System.out.println("reset");
        System.out.println("klan testa");

        Student student = getStudentById(rent.getInt("student_id"));
        Teacher teacher = getTeacherById(rent.getInt("teacher_id"));

        System.out.println("klan testa");
        System.out.println(student);
        System.out.println(teacher);

        Rent rent1 = em.find(Rent.class, rent.getInt("rent_id"));

        System.out.println("klan testa");
        System.out.println(rent.getInt("rent_id"));
        System.out.println(rent1);
        rent1.setStudent(student);
        rent1.setTeacher(teacher);

        System.out.println("klan testa");
        System.out.println(rent1);
        em.merge(rent1);
    }

    public List<Rent> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Rent");
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
}

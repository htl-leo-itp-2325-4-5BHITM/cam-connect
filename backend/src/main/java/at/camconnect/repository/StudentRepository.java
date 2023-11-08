package at.camconnect.repository;

import at.camconnect.model.Student;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class StudentRepository{
    @Inject
    EntityManager em;

    @Transactional
    public void create(Student s){
        em.persist(s);
    }

    @Transactional
    public void remove(Student s){
        em.remove(s);
    }

    @Transactional
    public void update(Student s){
        em.merge(s);
    }

    public Student getById(long id){
        return em.find(Student.class, id);
    }


    /*public Student getById(long id){
        Query q = em.createNativeQuery("SELECT * FROM Student where student_id = " + id);
        Student result = (Student) q.getSingleResult();
        return result;
    }*/

    public List<Student> getAll(){
        Query q = em.createNativeQuery("SELECT STUDENT_ID, FIRSTNAME, LASTNAME, SCHOOL_CLASS, PASSWORD, USER_ID FROM Student");
        List<Student> results = q.getResultList();
        return results;
    }

    public List<Student> search(JsonObject searchParams){
        Query q = em.createQuery("SELECT student_id, firstname, lastname FROM Student s WHERE upper(s.firstname) LIKE :firstname || '%' ")
                .setParameter("firstname", searchParams.getString("firstname").toUpperCase())
                .setMaxResults(10);
        List<Student> results = q.getResultList();
        return results;
    }
}

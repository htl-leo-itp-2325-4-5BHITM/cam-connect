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

    public Student getById(long id){
        return em.find(Student.class, id);
    }

    /**
     * @return List of all Students in db
     */
    public List<Student> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Student");
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

    @Transactional
    public void create(Student s){
        em.persist(s);
    }
}

package at.camconnect.repository;

import at.camconnect.model.Student;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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

    @Transactional
    public void create(Student s){
        em.persist(s);
    }

    public List<Student> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Student");
        List<Student> results = q.getResultList();
        return results;
    }
}

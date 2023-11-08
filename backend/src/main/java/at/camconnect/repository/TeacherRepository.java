package at.camconnect.repository;

import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Path;

import java.util.List;

@ApplicationScoped
public class TeacherRepository {
    @Inject
    EntityManager em;


    @Transactional
    public void create(Teacher t){
        em.persist(t);
    }

    @Transactional
    public void remove(Teacher t){
        em.remove(t);
    }

    @Transactional
    public void update(Teacher t){
        em.merge(t);
    }

    public Teacher getById(long id){
        return em.find(Teacher.class, id);
    }

    public List<Teacher> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Teacher");
        List<Teacher> results = q.getResultList();
        return results;
    }
}

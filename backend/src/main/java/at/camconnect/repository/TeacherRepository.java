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

    public Teacher getById(long id){
        return em.find(Teacher.class, id);
    }

    /**
     * @return List of all Students in db
     */
    public List<Teacher> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Teacher");
        List<Teacher> results = q.getResultList();
        return results;
    }

    public List<Teacher> searchByKey(String key){
        Query q = em.createQuery("SELECT firstname, lastname FROM Teacher t WHERE upper(t.firstname) LIKE :key || '%' ")
                .setParameter("key", key.toUpperCase())
                .setMaxResults(10);
        List<Teacher> results = q.getResultList();
        return results;
    }

    @Transactional
    public void create(Teacher t){
        em.persist(t);
    }
}

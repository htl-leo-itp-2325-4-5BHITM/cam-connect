package at.camconnect.repository;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
@Transactional
public class UserRepository {
    @Inject
    EntityManager em;

    public List<User> getAllStudents(){
        List<User> students = em.createQuery("SELECT s FROM User s", User.class).getResultList();
        return students;
    }

    public List<AutocompleteNumberOptionDTO> searchForStudent(String searchTerm){
        return em.createQuery(
                        "SELECT new at.camconnect.dtos.AutocompleteStringOptionDTO(s, s.user_id) FROM User s " +
                                "WHERE UPPER(s.firstname) LIKE :searchTerm " +
                                "OR UPPER(s.lastname) LIKE :searchTerm " +
                                "OR UPPER(CONCAT(s.firstname, ' ', s.lastname)) LIKE :searchTerm",
                        AutocompleteNumberOptionDTO.class)
                .setParameter("searchTerm", searchTerm.toUpperCase() + "%")
                .getResultList();
    }

    public List<User> getAllTeachers(){
        List<User> teachers = em.createQuery("SELECT t FROM User t", User.class).getResultList();
        return teachers;
    }

    public List<User> searchForTeacher(String searchTerm){
        Query q = em.createQuery("SELECT t FROM User t WHERE upper(t.lastname) LIKE :lastname || '%' ", User.class)
                .setParameter("lastname", searchTerm)
                .setMaxResults(10);
        List<User> results = q.getResultList();
        return results;
    }
}

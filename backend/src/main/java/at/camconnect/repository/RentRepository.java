package at.camconnect.repository;

import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import java.util.List;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void addRent(Rent rent){
        em.persist(rent);
    }

    @Transactional
    public void removeRent(Rent rent){
        em.remove(rent);
    }

    public List<Rent> getAll(){
        Query q = em.createNativeQuery("SELECT * FROM Rent");
        List<Rent> results = q.getResultList();
        return results;
    }

}

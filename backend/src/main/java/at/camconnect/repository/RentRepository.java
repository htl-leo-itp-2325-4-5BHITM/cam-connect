package at.camconnect.repository;

import at.camconnect.model.Rent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Transactional
    private void addRent(Rent rent){
        em.persist(rent);
    }

    @Transactional
    private void removeRent(Rent rent){
        em.remove(rent);
    }
}

package at.camconnect.repository;

import at.camconnect.model.Equipment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class EquipmentRepository {
    @Inject
    EntityManager em;

    public Equipment getById(long id){
        return em.find(Equipment.class, id);
    }

    public void add(Equipment e){
        em.persist(e);
    }
}

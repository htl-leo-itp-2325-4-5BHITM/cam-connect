package at.camconnect.repository;

import at.camconnect.model.DeviceSet;
import at.camconnect.model.DeviceType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class DeviceSetRepository {
    @Inject
    EntityManager em;

    public List<DeviceSet> getAll(){
        return em.createQuery("SELECT d FROM DeviceSet d order by d.id", DeviceSet.class).getResultList();
    }
}

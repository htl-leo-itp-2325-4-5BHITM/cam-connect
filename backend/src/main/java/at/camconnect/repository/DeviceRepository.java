package at.camconnect.repository;

import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
public class DeviceRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(Device device){
        em.persist(device);
    }

    @Transactional
    public void remove(Device d){
        em.remove(d);
    }

    @Transactional
    public void update(Device d){
        em.merge(d);
    }

    public Device getById(long id){
        return em.find(Device.class, id);
    }

    public List<Device> getAll(){
        List<Device> rents = em.createQuery("SELECT r FROM Rent r", Device.class).getResultList();
        return rents;
    }
}
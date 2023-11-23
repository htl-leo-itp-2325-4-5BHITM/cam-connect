package at.camconnect.repository;

import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
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

    public boolean importDevices(InputStream fileInputStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream))) {
            String line;

            while ((line = reader.readLine()) != null) {
                // Splitte die CSV-Zeile
                String[] values = line.split(",");

                // Füge die Werte zur Liste hinzu
                DeviceType deviceType = em.find(DeviceType.class, Integer.valueOf(values[2].trim()));
                if(deviceType == null){
                    return false;
                }
                Device device = new Device(values[0].trim(), values[1].trim(),deviceType);
                em.persist(device);
            }
            return true;
            // Hier hast du das CSV als List<String[]> und kannst es weiter verarbeiten
        } catch(Exception ex){
            return false;
        }
    }
}
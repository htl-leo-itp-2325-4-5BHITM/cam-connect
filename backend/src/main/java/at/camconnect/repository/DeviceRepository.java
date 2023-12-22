package at.camconnect.repository;

import at.camconnect.responseSystem.CCException;
import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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
    public void remove(Long id){
        em.remove(getById(id));
    }

    @Transactional
    public void update(Long id, JsonObject data) {
        try{
            setNumber(id, data.getString("number"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setNote(id, data.getString("note"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setSerial(id, data.getString("serial"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setType(id, data.getInt("number"));
        } catch(Exception ex){ System.out.println(ex.getMessage()); }
    }

    public Device getById(long id){
        Device device = em.find(Device.class, id);
        if (device == null) throw new CCException(1101);
        return device;
    }

    public List<Device> getAll(){
        List<Device> devices = em.createQuery("SELECT d FROM Device d", Device.class).getResultList();
        if(devices.isEmpty()){
            throw new CCException(1202);
        }
        return devices;
    }

    public void setNumber(long rentId, String number) {
        Device device = getById(rentId);
        device.setNumber(number);
    }

    public void setSerial(long rentId, String serial) {
        Device device = getById(rentId);
        device.setSerial(serial);
    }

    public void setNote(long rentId, String serial) {
        Device device = getById(rentId);
        device.setNote(serial);
    }

    public void setType(long rentId, int type) {
        Device device = getById(rentId);
        DeviceType deviceType = em.find(DeviceType.class, type);
        device.setType(deviceType);
    }

    public boolean importDevices(InputStream fileInputStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream))) {
            String line;

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");

                DeviceType deviceType = em.find(DeviceType.class, Integer.valueOf(values[2].trim()));
                if(deviceType == null){
                    return false;
                }

                //TODO there was a error in the device class the number attribute was missing
                Device device = new Device(values[0].trim(), "TODO", values[1].trim(),deviceType);
                em.persist(device);
            }
            return true;
        } catch(Exception ex){
            return false;
        }
    }
}
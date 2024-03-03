package at.camconnect.repository;

import at.camconnect.dtos.AutocompleteOptionDTO;
import at.camconnect.dtos.DeviceDTO;
import at.camconnect.dtos.DeviceTypeMinimalDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.socket.DeviceSocket;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class DeviceRepository {
    @Inject
    EntityManager em;

    @Inject
    DeviceSocket deviceSocket;

    @Transactional
    public void create(Device device){
        em.persist(device);
        deviceSocket.broadcast(getAll());
    }

    @Transactional
    public void remove(Long id){
        em.remove(getById(id));
        deviceSocket.broadcast(getAll());
    }

    @Transactional
    public void update(Long id, DeviceDTO data) {
        try{
            setNumber(id, data.number());
        } catch(NumberFormatException ex){ System.out.println(ex.getMessage()); throw new CCException(1106); };

        try{
            setNote(id, data.note());
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setSerial(id, data.serial());
        } catch(Exception ex){ System.out.println(ex.getMessage()); }

        try{
            setType(id, data.type_id());
        } catch(Exception ex){ System.out.println(ex.getMessage()); }
        deviceSocket.broadcast(getAll());
    }

    public Device getById(Long id){
        Device device = em.find(Device.class, id);
        if (device == null) throw new CCException(1101);
        return device;
    }

    public Device getByNumberAndType(String number, Long type_id){
        Device device;
        try{
            device = em.createQuery("select d from Device d where type.id = :type_id and number = :number", Device.class)
                    .setParameter("type_id", type_id)
                    .setParameter("number", number)
                    .getSingleResult();
        }
        catch (Exception ex){
            throw new CCException(1101);
        }

        if (device == null) throw new CCException(1101);

        return device;
    }

    public boolean validateNumberAndType(String number, Long type_id){
        Long count;
        try{
            count = em.createQuery("select count(d) from Device d where type.id = :type_id and number = :number", Long.class)
                    .setParameter("type_id", type_id)
                    .setParameter("number", number)
                    .getSingleResult();
        }
        catch (Exception ex){
            throw new CCException(1200);
        }

        return count > 0;
    }

    public List<AutocompleteOptionDTO<DeviceDTO>> search(String searchTerm){
        List<DeviceDTO> devices = em.createQuery(
                        "SELECT new at.camconnect.dtos.DeviceDTO(d.serial, d.number, d.note, d.type.id) FROM Device d " +
                                "WHERE UPPER(d.number) LIKE :searchTerm ",
                        DeviceDTO.class)
                .setParameter("searchTerm", searchTerm.toUpperCase() + "%")
                .getResultList();

        List<AutocompleteOptionDTO<DeviceDTO>> result = new LinkedList<>();

        for (DeviceDTO device : devices) {
            result.add(new AutocompleteOptionDTO<>(device, device.type_id()));
        }

        return result;
    }

    public List<AutocompleteOptionDTO<DeviceDTO>> searchWithType(String searchTerm, Long type_id){
        List<DeviceDTO> devices = em.createQuery(
                        "SELECT new at.camconnect.dtos.DeviceDTO(d.serial, d.number, d.note, d.type.id) FROM Device d " +
                                "WHERE UPPER(d.number) LIKE :searchTerm and " +
                                "d.type.id = :typeId",
                        DeviceDTO.class)
                .setParameter("searchTerm", searchTerm.toUpperCase() + "%")
                .setParameter("typeId", type_id)
                .getResultList();

        List<AutocompleteOptionDTO<DeviceDTO>> result = new LinkedList<>();

        for (DeviceDTO device : devices) {
            result.add(new AutocompleteOptionDTO<>(device, device.type_id()));
        }

        return result;
    }

    public List<Device> getAll(){
        List<Device> devices = em.createQuery("SELECT d FROM Device d", Device.class).getResultList();
        return devices;
    }

    public void setNumber(Long rentId, String number) {
        Device device = getById(rentId);
        device.setNumber(number);
        deviceSocket.broadcast(getAll());
    }

    public void setSerial(Long rentId, String serial) {
        Device device = getById(rentId);
        device.setSerial(serial);
        deviceSocket.broadcast(getAll());
    }

    public void setNote(Long rentId, String serial) {
        Device device = getById(rentId);
        device.setNote(serial);
        deviceSocket.broadcast(getAll());
    }

    public void setType(Long rentId, Long type) {
        Device device = getById(rentId);
        DeviceType deviceType = em.find(DeviceType.class, type);
        device.setType(deviceType);
        deviceSocket.broadcast(getAll());
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
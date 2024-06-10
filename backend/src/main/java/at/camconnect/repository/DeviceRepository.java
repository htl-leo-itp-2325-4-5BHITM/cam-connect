package at.camconnect.repository;

import at.camconnect.dtos.AutocompleteOptionDTO;
import at.camconnect.dtos.DeviceDTO;
import at.camconnect.dtos.DeviceSearchDTO;
import at.camconnect.dtos.rent.RentDTO;
import at.camconnect.enums.RentStatusEnum;
import at.camconnect.model.Rent;
import at.camconnect.responseSystem.CCException;
import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.socket.DeviceSocket;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.hibernate.exception.ConstraintViolationException;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
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
        deviceSocket.broadcast();
    }

    @Transactional
    public void remove(Long id){
        em.remove(getById(id));
        deviceSocket.broadcast();
    }

    @Transactional
    public void update(Long id, DeviceDTO data) {
        try{
            setNumber(id, data.number());
        } catch(NumberFormatException ex){ System.out.println(ex.getMessage()); throw new CCException(1106); }

        try{
            setNote(id, data.note());
        } catch(Exception ex){ System.out.println(ex.getMessage()); throw new CCException(1106); }

        try{
            setSerial(id, data.serial());
        } catch(Exception ex){ System.out.println(ex.getMessage()); throw new CCException(1106); }

        try{
            setType(id, data.type_id());
        } catch(Exception ex){ System.out.println(ex.getMessage()); throw new CCException(1106); }

        deviceSocket.broadcast();
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
            getById(1L);
        }
        catch (Exception ex){
            throw new CCException(1200);
        }

        return count > 0;
    }

    public List<AutocompleteOptionDTO<Device>> search(DeviceSearchDTO data){

        Query query;
        if(data.typeId() > 0) {
            query = em.createQuery("SELECT d FROM Device d " +
                    "WHERE UPPER(d.number) LIKE :searchTerm " +
                    "AND d.type.id = :typeId " +
                    "ORDER BY d.number", Device.class).setParameter("searchTerm", data.searchTerm().toUpperCase() + "%");
            query.setParameter("typeId", data.typeId());
        } else{
            query = em.createQuery("SELECT d FROM Device d " +
                    "WHERE UPPER(d.number) LIKE :searchTerm " +
                    "ORDER BY d.number", Device.class).setParameter("searchTerm", data.searchTerm().toUpperCase() + "%");
        }

        List<Device> devices = query.getResultList();
        List<AutocompleteOptionDTO<Device>> result = new LinkedList<>();
        for (Device device : devices) {
            if(data.onlyAvailable() && isDeviceAlreadyInUse(device.getDevice_id())){
                continue;
            }
            result.add(new AutocompleteOptionDTO<>(device, device.getDevice_id()));
        }

        return result;
    }

    public boolean isDeviceAlreadyInUse(long device_id) {
        return !em.createQuery("SELECT r FROM Rent r " +
                                  "where r.device.id = :deviceId and r.status != :status ",
                Rent.class)
                .setParameter("deviceId", device_id)
                .setParameter("status", RentStatusEnum.RETURNED)
                .getResultStream()
                .toList()
                .isEmpty();
    }

    public List<Device> getAll(){
        List<Device> devices = em.createQuery("SELECT d FROM Device d", Device.class).getResultList();
        return devices;
    }

    public void setNumber(Long rentId, String number) {
        Device device = getById(rentId);
        device.setNumber(number);
        deviceSocket.broadcast();
    }

    public void setSerial(Long rentId, String serial) {
        Device device = getById(rentId);
        device.setSerial(serial);
        deviceSocket.broadcast();
    }

    public void setNote(Long rentId, String serial) {
        Device device = getById(rentId);
        device.setNote(serial);
        deviceSocket.broadcast();
    }

    public void setType(Long rentId, Long type) {
        Device device = getById(rentId);
        DeviceType deviceType = em.find(DeviceType.class, type);
        device.setType(deviceType);
        deviceSocket.broadcast();
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

    public Response exportAllDevices() {
        StreamingOutput stream = os -> {
            try (Writer writer = new BufferedWriter(new OutputStreamWriter(os))) {
                writer.write(getCSVHeader());

                List<Device> devices = getAll();
                for (Device device : devices) {
                    String csvLine = buildCSVLine(device);
                    writer.write(csvLine);
                }
            } catch (IOException e) {
                throw new CCException(1200, "File creation failed");
            }
        };

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm");

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"device-" + dateFormat.format(new Date()) + ".csv\"")
                .build();
    }

    private String getCSVHeader() {
        return "serial;number;note;type;\n";
    }

    private String buildCSVLine(Device device) {
        return String.format("%s;%s;%s;%s;\n", device.getSerial(), device.getNumber(), device.getNote(), device.getType().getType_id());
    }

    @Transactional
    public void importDevices(File file) {
        if(file == null) throw new CCException(1105);

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();

            if(line == null || line.equals("")) throw new CCException(1203);
            String[] lineArray = line.split(";");
            if (lineArray.length <= 1) throw new CCException(1203);

            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            //checks if the csv file matches the required structure
            if(lineArray.length != 4) throw new CCException(1204, "invalid line length");

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");
                if(lineArray.length != 4) break;
                create(new Device(lineArray[0], lineArray[1], lineArray[2],
                        em.find(DeviceType.class, lineArray[3])));
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        } catch(NumberFormatException ex){
            throw new CCException(1106, "Wrong data type in the import file: " + ex.getMessage());
        } catch(ConstraintViolationException ex){
            throw new CCException(1201, "One device type does already exist " + ex.getMessage());
        } catch(IllegalArgumentException | ArrayIndexOutOfBoundsException ex){
            throw new CCException(1204);
        }
    }
}
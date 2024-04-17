package at.camconnect.repository;

import at.camconnect.dtos.*;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.model.DeviceTypeAttributes.*;
import at.camconnect.model.Student;
import at.camconnect.model.Tag;
import at.camconnect.responseSystem.CCException;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeVariants.*;
import at.camconnect.responseSystem.CCStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import org.hibernate.exception.ConstraintViolationException;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@ApplicationScoped
public class DeviceTypeRepository {
    @Inject
    EntityManager em;

    @Inject
    DeviceTypeAttributeRepository deviceTypeAttributeRepository;


    public DeviceType create(DeviceTypeVariantEnum typeEnum, JsonObject data){
        /* Why JsonData and not DTO
         * We use a single create endpoint to create lots of different types: this makes the process when calling
         * the api very easy. If we were to use a DTO here we would either have to hardcode all the different routes, or
         * switch case through the typeEnum and create a different entity with different params for each, this would then
         * require a factory or a abstract create method that returns a instance.
         */

        DeviceType deviceType = null;

        //use quarkus's built in object mapper to create a entity from the provided json
        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            deviceType = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1106, e.getMessage());
        }

        em.persist(deviceType);
        return deviceType;
    }

    public DeviceType getById(Long id) {
        DeviceType deviceType = em.find(DeviceType.class, id);
        if (deviceType == null) throw new CCException(1101);
        return deviceType;
    }

    public DeviceTypeCollection getAll(){
        List<CameraType> cameraTypes = em.createQuery("SELECT d FROM CameraType d WHERE d.status != :status", CameraType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<DroneType> droneTypes = em.createQuery("SELECT d FROM DroneType d where d.status != :status", DroneType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<LensType> lensTypes = em.createQuery("SELECT d FROM LensType d where d.status != :status", LensType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<LightType> lightTypes = em.createQuery("SELECT d FROM LightType d where d.status != :status", LightType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<MicrophoneType> microphoneTypes = em.createQuery("SELECT d FROM MicrophoneType d where d.status != :status", MicrophoneType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<StabilizerType> stabilizerTypes = em.createQuery("SELECT d FROM StabilizerType d where d.status != :status", StabilizerType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<TripodType> tripodTypes = em.createQuery("SELECT d FROM TripodType d where d.status != :status", TripodType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();

        return new DeviceTypeCollection(cameraTypes, droneTypes, lensTypes, lightTypes, microphoneTypes, stabilizerTypes, tripodTypes);
    }

    public List<AutocompleteOptionDTO<DeviceTypeMinimalDTO>> search(String searchTerm){
        List<DeviceTypeMinimalDTO> deviceTypes = new LinkedList<DeviceTypeMinimalDTO>();

        deviceTypes = em.createQuery(
                        "SELECT new at.camconnect.dtos.DeviceTypeMinimalDTO(d.id, d.variant, d.name, d.image) FROM DeviceType d " +
                                "WHERE UPPER(d.name) LIKE :searchTerm " +
                                "order by name",
                        DeviceTypeMinimalDTO.class)
                .setParameter("searchTerm", "%" + searchTerm.toUpperCase() + "%")
                .getResultList();

        List<AutocompleteOptionDTO<DeviceTypeMinimalDTO>> result = new LinkedList<>();

        for (DeviceTypeMinimalDTO deviceType : deviceTypes) {
            result.add(new AutocompleteOptionDTO<>(deviceType, deviceType.type_id()));
        }

        return result;
    }

    public List<DeviceTypeFullDTO> getAllFull() {
        List<DeviceType> deviceTypeList = em.createQuery("select dt from DeviceType dt", DeviceType.class).getResultList();

        List<DeviceTypeFullDTO> list = new LinkedList<>();
        for(DeviceType deviceType : deviceTypeList){
            Long availableDevices = em.createQuery(
                     "select coalesce(count(d), 0) from Device d " +
                        "where d.device_id not in (select r.device.device_id from Rent r where r.status != 3 and r.status != 4)" +
                        "group by d.type.type_id " +
                        "having d.type.type_id = :type_id", Long.class)
                    .setParameter("type_id", deviceType.getType_id())
                    .getResultStream().findFirst().orElse(0L);

            List<Tag> tagList = em.createQuery(
                     "SELECT t FROM Tag t " +
                        "JOIN FETCH t.type dt " +
                        "WHERE dt = :deviceType", Tag.class)
                    .setParameter("deviceType", deviceType)
                    .getResultList();

            list.add(new DeviceTypeFullDTO(deviceType, availableDevices.intValue(), tagList));
        }
        return list;
    }

    public void remove(Long id){
        DeviceType deviceType = getById(id);
        deviceType.setStatus(DeviceTypeStatusEnum.disabled);
        em.merge(deviceType);
    }

    public DeviceType update(Long id, DeviceTypeGlobalIdDTO data){
        DeviceType deviceType = getById(id); //should result in a child of DeviceType like CameraType

        deviceType.setName(data.name());
        deviceType.setImage(data.image());

        //The DeviceTypeDTO is converted into a DeviceType global which contains objects instead of ids
        DeviceTypeGlobalObjectsDTO dataWithObjects = new DeviceTypeGlobalObjectsDTO(
                data.autofocus(), data.f_stop(), data.focal_length(), data.framerate(), data.height_centimeters(), data.max_range(), data.max_weight_kilograms(), data.needsrecorder(), data.number_of_axis(), data.autofocus(), data.variable_temperature(), data.watts(), data.windblocker(), data.wireless(),
                getAttribute(TripodHead.class, data.head_id()), getAttribute(LensMount.class, data.mount_id()), getAttribute(CameraResolution.class, data.resolution_id()), getAttribute(CameraSensor.class, data.sensor_id()), getAttribute(CameraSystem.class, data.system_id()),
                data.type_id(), data.dtype(), data.image(), data.name(), data.description());

        //just call the update method on whichever child class it is
        deviceType.update(dataWithObjects);
        return deviceType;
    }

    //region utility functions
    private Class<? extends DeviceType> enumToClass(DeviceTypeVariantEnum typeEnum) {
        //yes there are breaks missing, but they are unnecessary because of the returns
        switch (typeEnum) {
            case microphone:
                return MicrophoneType.class;
            case camera:
                return CameraType.class;
            case drone:
                return DroneType.class;
            case lens:
                return LensType.class;
            case light:
                return LightType.class;
            case stabilizer:
                return StabilizerType.class;
            case tripod:
                return TripodType.class;
        }

        throw new CCException(1104);
    }

    //basically a wrapper for em.find but filters out nulls
    private <T> T getAttribute(Class<T> type, Long id){
        if(id == null) return null;
        return em.find(type, id);
    }

    //endregion

    @Transactional
    public void importDeviceTypes(File file, String type) {
        HashMap<Integer, List<String>> typeMap = new HashMap<>();
        typeMap.put(7, new LinkedList<>(){{ add("camera"); }});
        typeMap.put(4, new LinkedList<>(){{ add("drone"); add("lens"); add("light"); add("microphone"); }});
        typeMap.put(3, new LinkedList<>(){{ add("stabilizer"); add("tripod"); }});
        typeMap.put(2, new LinkedList<>(){{ add("simple"); }});

        if (file == null) throw new CCException(1105);

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            if (line == null || line.isEmpty()) throw new CCException(1203);

            String[] lineArray = line.split(";");
            int headerLength = lineArray.length;

            if(!typeMap.get(headerLength).contains(type)) throw new CCException(1204);

            if (headerLength <= 1) throw new CCException(1203);

            //removes characters like our friend \uFEFF a invisible zero space character added to csv files when opening excel that throws off my validations :)
            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");

                if (lineArray.length != headerLength) throw new CCException(1204, lineArray[0] + " has not a valid structure");

                try {
                    DeviceType deviceType = switch (type) {
                        case "camera" -> new CameraType(lineArray[0],
                                em.find(CameraSensor.class, lineArray[1]),
                                em.find(CameraResolution.class, lineArray[2]),
                                em.find(LensMount.class, lineArray[3]),
                                em.find(CameraSystem.class, lineArray[4]),
                                Integer.parseInt(lineArray[5]), Boolean.parseBoolean(lineArray[6]));
                        case "drone" -> new DroneType(lineArray[0],
                                em.find(CameraSensor.class, lineArray[1]),
                                em.find(CameraResolution.class, lineArray[2]),
                                Integer.parseInt(lineArray[3]));
                        case "lens" -> new LensType(lineArray[0], lineArray[1],
                                em.find(LensMount.class, lineArray[2]), lineArray[3]);
                        case "light" -> new LightType(lineArray[0], Integer.parseInt(lineArray[1]),
                                Boolean.parseBoolean(lineArray[2]), Boolean.parseBoolean(lineArray[3]));
                        case "microphone" -> new MicrophoneType(lineArray[0], Boolean.parseBoolean(lineArray[1]),
                                Boolean.parseBoolean(lineArray[2]), Boolean.parseBoolean(lineArray[3]));
                        case "simple" -> new SimpleType(lineArray[0], lineArray[1]);
                        case "stabilizer" -> new StabilizerType(lineArray[0],
                                Double.parseDouble(lineArray[1]), Integer.parseInt(lineArray[2]));
                        case "tripod" -> new TripodType(lineArray[0], Integer.parseInt(lineArray[1]),
                                em.find(TripodHead.class, lineArray[2]));
                        default -> null;
                    };

                    em.persist(deviceType);

                } catch(NumberFormatException ex){
                    throw new CCException(1106, "Wrong data type in the import file: " + ex.getMessage());
                } catch(ConstraintViolationException ex){
                    throw new CCException(1201, "One device type does already exist " + ex.getMessage());
                } catch(IllegalArgumentException | ArrayIndexOutOfBoundsException ex){
                    throw new CCException(1204);
                }
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        }
    }
}

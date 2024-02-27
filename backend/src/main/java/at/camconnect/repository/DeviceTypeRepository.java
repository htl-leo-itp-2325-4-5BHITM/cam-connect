package at.camconnect.repository;

import at.camconnect.dtos.*;
import at.camconnect.model.DeviceTypeAttributes.*;
import at.camconnect.model.Student;
import at.camconnect.model.Tag;
import at.camconnect.responseSystem.CCException;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeVariants.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Table;

import java.util.LinkedList;
import java.util.List;

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
        List<CameraType> cameraTypes = em.createQuery("SELECT d FROM CameraType d", CameraType.class).getResultList();
        List<DroneType> droneTypes = em.createQuery("SELECT d FROM DroneType d", DroneType.class).getResultList();
        List<LensType> lensTypes = em.createQuery("SELECT d FROM LensType d", LensType.class).getResultList();
        List<LightType> lightTypes = em.createQuery("SELECT d FROM LightType d", LightType.class).getResultList();
        List<MicrophoneType> microphoneTypes = em.createQuery("SELECT d FROM MicrophoneType d", MicrophoneType.class).getResultList();
        List<StabilizerType> stabilizerTypes = em.createQuery("SELECT d FROM StabilizerType d", StabilizerType.class).getResultList();
        List<TripodType> tripodTypes = em.createQuery("SELECT d FROM TripodType d", TripodType.class).getResultList();

        return new DeviceTypeCollection(cameraTypes, droneTypes, lensTypes, lightTypes, microphoneTypes, stabilizerTypes, tripodTypes);
    }

    public List<DeviceTypeFullDTO> getAllFull() {
        List<DeviceType> deviceTypeList = em.createQuery("select dt from DeviceType dt", DeviceType.class).getResultList();

        List<DeviceTypeFullDTO> list = new LinkedList<>();
        for(DeviceType deviceType : deviceTypeList){
            int availableDevices = em.createQuery("select count(d) from Device d " +
                    "where d.device_id not in (select r.device.device_id from Rent r) " +
                    "group by d.type.type_id", Integer.class).getSingleResult();
            /**List<Tag> tagList = em.createQuery("select t from Tag t " +
                    "join DeviceType dt on dt = t.type" +
                    "where type_type_id = 1;", Tag.class).getResultList();**/
        }
        return list;
    }

    public List<AutocompleteOptionDTO> search(String searchTerm){
        return em.createQuery(
                        "SELECT new at.camconnect.dtos.AutocompleteOptionDTO(d.name, d.id, 'TODO') FROM DeviceType d " +
                                "WHERE UPPER(d.name) LIKE :searchTerm ",
                        AutocompleteOptionDTO.class)
                .setParameter("searchTerm", searchTerm.toUpperCase() + "%")
                .getResultList();
    }

    public void remove(Long id){
        em.remove(getById(id));
    }

    public DeviceType update(Long id, DeviceTypeDTO data){
        DeviceType deviceType = getById(id); //should result in a child of DeviceType like CameraType

        deviceType.setName(data.name());
        deviceType.setImage(data.image());

        //The DeviceTypeDTO is converted into a DeviceType global which contains objects instead of ids
        DeviceTypeGlobal dataWithObjects = new DeviceTypeGlobal(
                data.autofocus(), data.f_stop(), data.focal_length(), data.framerate(), data.height(), data.max_range(), data.max_weight(), data.needsrecorder(), data.number_of_axis(), data.autofocus(), data.variable_temperature(), data.watts(), data.windblocker(), data.wireless(),
                getAttribute(TripodHead.class, data.head_id()), getAttribute(LensMount.class, data.mount_id()), getAttribute(CameraResolution.class, data.resolution_id()), getAttribute(CameraSensor.class, data.sensor_id()), getAttribute(CameraSystem.class, data.system_id()),
                data.type_id(), data.dtype(), data.image(), data.name());

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
}

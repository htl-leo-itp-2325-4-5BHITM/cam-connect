package at.camconnect.repository;

import at.camconnect.dtos.DeviceTypeDTO;
import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.*;
import at.camconnect.responseSystem.CCException;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class DeviceTypeRepository {
    @Inject
    EntityManager em;

    @Inject
    DeviceTypeAttributeRepository deviceTypeAttributeRepository;

    public DeviceType create(DeviceTypeEnum typeEnum, JsonObject data){
        /* Why JsonData and not DTO
         * We use a single create endpoint to create lots of different types this just makes the process when calling
         * the api very easy. If we were to use a DTO here we would either have to hardcode all the different routes, or
         * switch case through the typeEnum and create a different entity with different params for each. Plus we would
         * run into the poor type mismatching errors as described in the update function.
         */

        DeviceType deviceType = null;
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

    public List<DeviceType> getAll(){
        return em.createQuery("SELECT d FROM DeviceType d", DeviceType.class).getResultList();
    }

    public void remove(Long id){
        em.remove(getById(id));
    }

    public void update(Long id, JsonObject jsonData){
        /* Why JsonData and not DTO
         * The main problem is that quarkus handles object mapping before any other exception, this means that
         * when POSTing to the update endpoint with mismatched DTO format you would always get a meaningless 400 response
         * I dove down the ExceptionMapper rabbit hole but even when overriding every all exceptions: there is no way to
         * catch the json to class-instance conversion.
         * In conclusion: we will keep this param as JsonData and catch the exception here so that we can manage it and
         * properly pass it to a CCResponse.
         */

        //The JsonData is mapped to a generic DeviceTypeDTO that keeps all the ids as ids
        DeviceTypeDTO data;
        String dataString = String.valueOf(jsonData);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            data = objectMapper.readValue(dataString, DeviceTypeDTO.class);
        } catch (JsonProcessingException e) {
            throw new CCException(1106, e.getMessage());
        }

        DeviceType deviceType = getById(id); //should result in a child of DeviceType like CameraType
        deviceType.setName(data.name());

        //The DeviceTypeDTO is converted into a DeviceType global which contains objects instead of ids
        DeviceTypeGlobal dataWithObjects = new DeviceTypeGlobal(
                data.autofocus(), data.f_stop(), data.focal_length(), data.framerate(), data.height(), data.max_range(), data.max_weight(), data.needsrecorder(), data.number_of_axis(), data.autofocus(), data.variable_temperature(), data.watts(), data.windblocker(), data.wireless(),
                getAttribute(TripodHead.class, data.head_id()), getAttribute(LensMount.class, data.mount_id()), getAttribute(CameraResolution.class, data.resolution_id()), getAttribute(CameraSensor.class, data.sensor_id()), getAttribute(CameraSystem.class, data.system_id()),
                data.type_id(), data.dtype(), data.image(), data.name());

        //just call the update method on whichever child class it is
        deviceType.update(dataWithObjects);
    }

    //region utility functions
    private Class<? extends DeviceType> enumToClass(DeviceTypeEnum typeEnum) {
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

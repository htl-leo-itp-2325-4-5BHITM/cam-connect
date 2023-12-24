package at.camconnect.repository;

import at.camconnect.dtos.DeviceTypeAttributeDTO;
import at.camconnect.dtos.DeviceTypeDTO;
import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.enums.DeviceTypeAttributeEnum;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.*;
import at.camconnect.model.DeviceTypes.*;
import at.camconnect.responseSystem.CCException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class DeviceTypeAttributeRepository {
    @Inject
    EntityManager em;
    public DeviceTypeAttribute create(DeviceTypeAttributeEnum typeEnum, JsonObject data){
        DeviceTypeAttribute deviceTypeAttribute = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            deviceTypeAttribute = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1106, e.getMessage());
        }

        em.persist(deviceTypeAttribute);
        return deviceTypeAttribute;
    }

    public DeviceTypeAttribute getById(Long id) {
        DeviceTypeAttribute deviceTypeAttribute = em.find(DeviceTypeAttribute.class, id);
        if (deviceTypeAttribute == null) throw new CCException(1101);
        return deviceTypeAttribute;
    }

    public DeviceTypeAttribute update(Long id, DeviceTypeAttributeDTO data){
        DeviceTypeAttribute deviceTypeAttribute = getById(id); //should result in a child of DeviceTypeAttribute like CameraType

        deviceTypeAttribute.setName(data.name());
        deviceTypeAttribute.setDetails(data.details());

        //just call the update method on whichever child class it is
        deviceTypeAttribute.update(data);
        return deviceTypeAttribute;
    }

    public void remove(Long id){
        em.remove(getById(id));
    }

    public List<DeviceTypeAttribute> getAll(){
        return em.createQuery("SELECT d FROM DeviceTypeAttribute d", DeviceTypeAttribute.class).getResultList();
    }

    //region utility functions
    private Class<? extends DeviceTypeAttribute> enumToClass(DeviceTypeAttributeEnum typeEnum) {
        //yes there are breaks missing, but they are unnecessary because of the returns
        switch (typeEnum) {
            case cameraresolution:
                return CameraResolution.class;
            case camerasensor:
                return CameraSensor.class;
            case camerasystem:
                return CameraSystem.class;
            case lensmount:
                return LensMount.class;
            case tripodhead:
                return TripodHead.class;
            default:
                throw new CCException(1104);
        }
    }

    //endregion
}

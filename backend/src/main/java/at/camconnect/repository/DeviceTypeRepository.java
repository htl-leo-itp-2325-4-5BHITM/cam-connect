package at.camconnect.repository;

import at.camconnect.CCError;
import at.camconnect.CCException;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DeviceTypeRepository {
    @Inject
    EntityManager em;

    public CCError create(DeviceTypeEnum typeEnum, JsonObject data){
        DeviceType deviceType = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            deviceType = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1006);
        }

        em.persist(deviceType);

        return new CCError(1000);
    }

    public void update(Long id, JsonObject data){
        DeviceType deviceType = em.find(DeviceType.class, id);
        deviceType.update(data);
    }

    //region utility functions
    private Class<? extends DeviceType> enumToClass(DeviceTypeEnum typeEnum) {
        //yes there are breaks missing, but they are unnecessary because of the returns
        switch(typeEnum){
            case audio:
                return AudioType.class;
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
}

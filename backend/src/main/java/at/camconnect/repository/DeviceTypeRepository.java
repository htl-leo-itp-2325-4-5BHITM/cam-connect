package at.camconnect.repository;

import at.camconnect.enums.DeviceTypes;
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

    public void create(DeviceTypes type, JsonObject data){
        DeviceType deviceType = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            switch (type){
                case Audio:
                        deviceType = objectMapper.readValue(dataString, AudioType.class);
                    break;
                case Camera:
                        deviceType = objectMapper.readValue(dataString, CameraType.class);
                    break;
                case Drone:
                        deviceType = objectMapper.readValue(dataString, DroneType.class);
                    break;
                case Lens:
                        deviceType = objectMapper.readValue(dataString, LensType.class);
                    break;
                case Light:
                        deviceType = objectMapper.readValue(dataString, LightType.class);
                    break;
                case Stabilizer:
                        deviceType = objectMapper.readValue(dataString, StabilizerType.class);
                    break;
                case Tripod:
                        deviceType = objectMapper.readValue(dataString, TripodType.class);
                    break;
            }

            em.persist(deviceType);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

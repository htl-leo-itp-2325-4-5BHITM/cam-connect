package at.camconnect.repository;

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

    public void create(DeviceTypeEnum type, JsonObject data){
        DeviceType deviceType = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            switch (type){
                case audio:
                        deviceType = objectMapper.readValue(dataString, AudioType.class);
                    break;
                case camera:
                        deviceType = objectMapper.readValue(dataString, CameraType.class);
                    break;
                case drone:
                        deviceType = objectMapper.readValue(dataString, DroneType.class);
                    break;
                case lens:
                        deviceType = objectMapper.readValue(dataString, LensType.class);
                    break;
                case light:
                        deviceType = objectMapper.readValue(dataString, LightType.class);
                    break;
                case stabilizer:
                        deviceType = objectMapper.readValue(dataString, StabilizerType.class);
                    break;
                case tripod:
                        deviceType = objectMapper.readValue(dataString, TripodType.class);
                    break;
            }

            em.persist(deviceType);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

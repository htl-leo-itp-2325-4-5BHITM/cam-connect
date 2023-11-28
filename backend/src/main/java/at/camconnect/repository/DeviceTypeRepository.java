package at.camconnect.repository;

import at.camconnect.errorSystem.CCError;
import at.camconnect.errorSystem.CCException;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.*;
import at.camconnect.model.DeviceTypes.attributes.CameraResolution;
import at.camconnect.model.DeviceTypes.attributes.CameraSensor;
import at.camconnect.model.DeviceTypes.attributes.LensMount;
import at.camconnect.model.DeviceTypes.attributes.TripodHead;
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

    public void create(DeviceTypeEnum typeEnum, JsonObject data){
        DeviceType deviceType = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            deviceType = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1006);
        }

        em.persist(deviceType);
    }

    //I know this guy is brutal but I cant split it into the individual models cause of the id to entity conversion
    public void update(Long id, DeviceTypeEnum typeEnum, JsonObject data){
        switch(typeEnum){
            case audio:
                AudioType audioType = em.find(AudioType.class, id);
                try{
                    audioType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    audioType.setWindblocker(data.getBoolean("windblocker"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    audioType.setWireless(data.getBoolean("wireless"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    audioType.setNeedsRecorder(data.getBoolean("recorder"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case camera:
                CameraType cameraType = em.find(CameraType.class, id);
                try{
                    cameraType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    cameraType.setSensor(em.find(CameraSensor.class, data.getInt("sensor_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    cameraType.setMount(em.find(LensMount.class, data.getInt("mount_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    cameraType.setResolution(em.find(CameraResolution.class, data.getInt("resolution_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case drone:
                DroneType droneType = em.find(DroneType.class, id);
                try{
                    droneType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    droneType.setSensor(em.find(CameraSensor.class, data.getInt("sensor_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    droneType.setResolution(em.find(CameraResolution.class, data.getInt("resolution_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    droneType.setMax_range(data.getInt("max_range"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case lens:
                LensType lensType = em.find(LensType.class, id);
                try{
                    lensType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lensType.setFocal_length(data.getInt("focal_length"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lensType.setF_stop(data.getInt("f_stop"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lensType.setLens_mount(em.find(LensMount.class, data.getInt("mount_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case light:
                LightType lightType = em.find(LightType.class, id);
                try{
                    lightType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lightType.setRgb(data.getBoolean("rgb"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lightType.setWatts(data.getInt("watts"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    lightType.setVariable_temperature(data.getBoolean("variable_temperatur"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case stabilizer:
                StabilizerType stabilizerType = em.find(StabilizerType.class, id);
                try{
                    stabilizerType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    stabilizerType.setNumber_of_axis(data.getInt("number_of_axis"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    stabilizerType.setMax_weight(data.getInt("max_weight"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
            case tripod:
                TripodType tripodType = em.find(TripodType.class, id);
                try{
                    tripodType.setName(data.getString("name"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    tripodType.setHeight(data.getInt("height"));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                try{
                    tripodType.setHead(em.find(TripodHead.class, data.getInt("head_id")));
                }catch (Exception ex){
                    throw new CCException(1106);
                }
                break;
        }
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

    public DeviceType getById(Long id) {
        DeviceType result = em.find(DeviceType.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }

    //endregion
}

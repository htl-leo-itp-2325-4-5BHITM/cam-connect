package at.camconnect.repository;

import at.camconnect.model.Student;
import at.camconnect.statusSystem.CCException;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.*;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.model.DeviceTypeAttributes.TripodHead;
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

    public void create(DeviceTypeEnum typeEnum, JsonObject data){
        DeviceType deviceType = null;

        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();


        try {
            deviceType = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1106, e.getMessage());
        }

        em.persist(deviceType);
    }

    public DeviceType getById(Long id) {
        DeviceType deviceType = em.find(DeviceType.class, id);
        if (deviceType == null) throw new CCException(1101);
        return deviceType;
    }

    public List<DeviceType> getAll(){
        List<DeviceType> deviceTypes = em.createQuery("SELECT d FROM DeviceType d", DeviceType.class).getResultList();
        return deviceTypes;
    }

    public void checkForNull(DeviceType deviceType){
        if (deviceType == null) throw new CCException(1101);
    }

    public void remove(Long id){
        em.remove(getById(id));
    }

    //I know this guy is brutal but I cant split it into the individual models cause of the id to entity conversion
    public void update(Long id, DeviceTypeEnum typeEnum, JsonObject data){
        //not only sets the name but by running the "getById" also checks for invalid ids
        //note: I did not find a way to reduce to a single em.find because of how java extends works
        DeviceType deviceType = getById(id);
        try{
            deviceType.setName(data.getString("name"));
        }catch (Exception ex){
            throw new CCException(1106);
        }

        switch(typeEnum){
            case audio:
                AudioType audioType = em.find(AudioType.class, id);

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
        switch (typeEnum) {
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

    //endregion
}

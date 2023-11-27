package at.camconnect.model.DeviceTypes;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.DeviceType;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;

@Entity
public class DroneType extends DeviceType {
    private String sensor;
    private String resolution;
    private int max_range;

    public DroneType(String typeName, String sensor, String resolution, int max_range) {
        super(typeName);
        this.sensor = sensor;
        this.resolution = resolution;
        this.max_range = max_range;
    }

    public DroneType() {
    }

    @Override
    public void update(JsonObject data) {
        try{
            setMax_range(data.getInt("max_range"));
        }catch (Exception ex){
            throw new CCException(1006, "max range was not updated");
        }

        //TODO add resolution and sensor update
    }

    public String getSensor() {
        return sensor;
    }

    public void setSensor(String sensor) {
        this.sensor = sensor;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public int getMax_range() {
        return max_range;
    }

    public void setMax_range(int maxRange) {
        this.max_range = maxRange;
    }
}

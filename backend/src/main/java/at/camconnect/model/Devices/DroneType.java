package at.camconnect.model.Devices;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class DroneType extends DeviceType {
    private String sensor;
    private String resolution;
    private int maxRange;

    public DroneType(String typeName, long typeId, String sensor, String resolution, int maxRange) {
        super(typeName, typeId);
        this.sensor = sensor;
        this.resolution = resolution;
        this.maxRange = maxRange;
    }

    public DroneType() {
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

    public int getMaxRange() {
        return maxRange;
    }

    public void setMaxRange(int maxRange) {
        this.maxRange = maxRange;
    }
}

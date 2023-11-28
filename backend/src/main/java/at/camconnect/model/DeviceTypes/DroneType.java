package at.camconnect.model.DeviceTypes;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.attributes.CameraResolution;
import at.camconnect.model.DeviceTypes.attributes.CameraSensor;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DroneType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private CameraSensor sensor;
    @ManyToOne
    @JoinColumn(name = "resolution_id")
    private CameraResolution resolution;
    private int max_range;

    public DroneType(String typeName, CameraSensor sensor, CameraResolution resolution, int max_range) {
        super(typeName);
        this.sensor = sensor;
        this.resolution = resolution;
        this.max_range = max_range;
    }

    public DroneType() {
    }

    public CameraSensor getSensor() {
        return sensor;
    }

    public void setSensor(CameraSensor sensor) {
        this.sensor = sensor;
    }

    public CameraResolution getResolution() {
        return resolution;
    }

    public void setResolution(CameraResolution resolution) {
        this.resolution = resolution;
    }

    public int getMax_range() {
        return max_range;
    }

    public void setMax_range(int maxRange) {
        this.max_range = maxRange;
    }
}

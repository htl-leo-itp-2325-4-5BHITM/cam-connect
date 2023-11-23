package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class CameraType extends DeviceType {
    private String sensor;
    private String resolution;
    private String mount;
    public CameraType() {
    }

    public CameraType(String typeName, long typeId, String sensor, String resolution, String mount) {
        super(typeName, typeId);
        this.sensor = sensor;
        this.resolution = resolution;
        this.mount = mount;
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

    public String getMount() {
        return mount;
    }

    public void setMount(String mount) {
        this.mount = mount;
    }
}

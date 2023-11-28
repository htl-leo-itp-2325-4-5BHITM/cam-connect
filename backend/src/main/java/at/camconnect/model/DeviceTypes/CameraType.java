package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.attributes.CameraResolution;
import at.camconnect.model.DeviceTypes.attributes.CameraSensor;
import at.camconnect.model.DeviceTypes.attributes.LensMount;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class CameraType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private CameraSensor sensor;
    @ManyToOne
    @JoinColumn(name = "resolution_id")
    private CameraResolution resolution;
    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount mount;
    public CameraType() {
    }
    public CameraType(String typeName, CameraSensor sensor, CameraResolution resolution, LensMount mount) {
        super(typeName);
        this.sensor = sensor;
        this.resolution = resolution;
        this.mount = mount;
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

    public LensMount getMount() {
        return mount;
    }

    public void setMount(LensMount mount) {
        this.mount = mount;
    }
}

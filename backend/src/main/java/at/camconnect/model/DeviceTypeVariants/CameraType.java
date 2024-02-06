package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.model.DeviceTypeAttributes.CameraSystem;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.responseSystem.CCException;
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
    @ManyToOne
    @JoinColumn(name = "system_id")
    private CameraSystem system;
    private int framerate;
    private boolean autofocus;

    @Override
    public void update(DeviceTypeGlobal data) {
        try {
            setAutofocus(data.autofocus());
            setFramerate(data.framerate());
            setMount(data.mount());
            setResolution(data.resolution());
            setSystem(data.system());
            setSensor(data.sensor());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public CameraType() {
    }
    public CameraType(String typeName, CameraSensor sensor, CameraResolution resolution, LensMount mount, CameraSystem system, int framerate, boolean autofocus) {
        super(typeName);
        this.sensor = sensor;
        this.resolution = resolution;
        this.mount = mount;
        this.system = system;
        this.framerate = framerate;
        this.autofocus = autofocus;
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

    public int getFramerate() {
        return framerate;
    }

    public void setFramerate(int framerate) {
        this.framerate = framerate;
    }

    public boolean isAutofocus() {
        return autofocus;
    }

    public void setAutofocus(boolean autofocus) {
        this.autofocus = autofocus;
    }

    public CameraSystem getSystem() {
        return system;
    }

    public void setSystem(CameraSystem system) {
        this.system = system;
    }
}

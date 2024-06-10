package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.model.DeviceTypeAttributes.CameraSystem;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

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
    @Column(length = 15)
    private int framerate;
    private boolean autofocus;

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
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
        super();
        setVariant(DeviceTypeVariantEnum.camera);
    }
    public CameraType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, CameraSensor sensor, CameraResolution resolution, LensMount mount, CameraSystem system, int framerate, boolean autofocus) {
        super(type_id, creation_date, name, image, status, variant);
        this.sensor = sensor;
        this.resolution = resolution;
        this.mount = mount;
        this.system = system;
        this.framerate = framerate;
        this.autofocus = autofocus;
    }

    @Override
    public String toString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%d;%d;%d;%d;%b;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getSensor() != null ? getSensor().getAttribute_id() : null,
                getResolution() != null ? getResolution().getAttribute_id() : null,
                getMount() != null ? getMount().getAttribute_id() : null,
                getSystem() != null ? getSystem().getAttribute_id(): null,
                getFramerate(), isAutofocus());
    }

    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%d;%d;%d;%d;%b; ; ; ; ; ; ; ; ; ; ; ; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getSensor() != null ? getSensor().getAttribute_id() : null,
                getResolution() != null ? getResolution().getAttribute_id() : null,
                getMount() != null ? getMount().getAttribute_id() : null,
                getSystem() != null ? getSystem().getAttribute_id(): null,
                getFramerate(), isAutofocus());
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

package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.model.DeviceTypeAttributes.CameraSystem;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.List;

@Entity
public class CameraType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount mount;
    @ManyToOne
    @JoinColumn(name = "system_id")
    private CameraSystem system;
    @ManyToOne
    @JoinColumn(name = "photo_resolution_id")
    private CameraResolution photo_resolution;
    private boolean autofocus;

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        super.update(data);
        try {
            setAutofocus(data.autofocus());
            setMount(data.mount());
            setSystem(data.system());
            setPhoto_resolution(data.photo_resolution());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public CameraType() {
        super();
        setVariant(DeviceTypeVariantEnum.camera);
    }
    public CameraType(String name, String image, LensMount mount, CameraSystem system, boolean autofocus) {
        super(name, image, DeviceTypeVariantEnum.camera);
        this.mount = mount;
        this.system = system;
        this.autofocus = autofocus;
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return null;
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of(mount, system, photo_resolution);
    }

    public LensMount getMount() {
        return mount;
    }

    public void setMount(LensMount mount) {
        this.mount = mount;
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

    public CameraResolution getPhoto_resolution() {
        return photo_resolution;
    }

    public void setPhoto_resolution(CameraResolution photo_resolution) {
        this.photo_resolution = photo_resolution;
    }
}

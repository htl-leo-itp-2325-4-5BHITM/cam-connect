package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.List;

@Entity
public class LensType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount mount;
    @Column(length = 15)
    private String f_stop;
    @Column(length = 15)
    private String focal_length;

    public LensType(String name, String image, LensMount mount, String f_stop, String focal_length) {
        super(name, image, DeviceTypeVariantEnum.lens);
        this.f_stop = f_stop;
        this.mount = mount;
        this.focal_length = focal_length;
    }

    public LensType() {
        super();
        setVariant(DeviceTypeVariantEnum.lens);
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setName(data.name());
            setImage_blob(data.image());
            setF_stop(data.f_stop());
            setFocal_length(data.focal_length());
            setMount(data.mount());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return "todo";
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getImage_blob(), getF_stop(), getFocal_length(), getMount().getAttribute_id());
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of(mount);
    }

    //region getter setter
    public String getF_stop() {
        return f_stop;
    }

    public void setF_stop(String f_stop) {
        this.f_stop = f_stop;
    }

    public String getFocal_length() {
        return focal_length;
    }

    public void setFocal_length(String focal_length) {
        this.focal_length = focal_length;
    }

    public LensMount getMount() {
        return mount;
    }

    public void setMount(LensMount lens_mount) {
        this.mount = lens_mount;
    }

    //endregion
}

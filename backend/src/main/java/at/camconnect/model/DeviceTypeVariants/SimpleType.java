package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.util.List;

@Entity
public class SimpleType extends DeviceType {
    @Column(length = 150)
    private String description;

    public SimpleType() {
        super();
        setVariant(DeviceTypeVariantEnum.simple);
    }

    public SimpleType(String name, String image, String description) {
        super(name, image, DeviceTypeVariantEnum.simple);
        this.description = description;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setDescription(data.description());
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
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getDescription(), getImage_blob());
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

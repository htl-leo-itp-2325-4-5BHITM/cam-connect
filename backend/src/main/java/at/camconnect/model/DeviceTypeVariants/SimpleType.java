package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class SimpleType extends DeviceType {
    @Column(length = 150)
    private String description;

    public SimpleType() {
        super();
        setVariant(DeviceTypeVariantEnum.simple);
    }

    public SimpleType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, String description) {
        super(type_id, creation_date, name, image, status, variant);
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
        return String.format("%d;%s;%s;%s;%s;%s;%s;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getDescription());
    }

    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;%s;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getDescription()
        );
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getDescription(), getImage());
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

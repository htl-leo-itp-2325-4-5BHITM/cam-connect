package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;

@Entity
public class SimpleType extends DeviceType {
    private String description;

    public SimpleType() {
        setVariant(DeviceTypeVariantEnum.simple);
    }

    public SimpleType(String name, String description) {
        super(name);
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

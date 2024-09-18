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
public class LightType extends DeviceType {
    @Column(length = 6)
    private int watts;
    private boolean rgb;
    @Column(length = 6)
    private boolean variable_temperature;

    public LightType(String name, String image, int watts, boolean rgb, boolean variable_temperature) {
        super(name, image, DeviceTypeVariantEnum.light);
        this.watts = watts;
        this.rgb = rgb;
        this.variable_temperature = variable_temperature;
    }

    public LightType() {
        super();
        setVariant(DeviceTypeVariantEnum.light);
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setName(data.name());
            setImage_blob_url(data.image());
            setRgb(data.rgb());
            setWatts(data.watts());
            setVariable_temperature(data.variable_temperature());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return "asdf";
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getImage_blob_url(), isRgb(), isVariable_temperature(), getWatts());
    }

    public int getWatts() {
        return watts;
    }

    public void setWatts(int watts) {
        this.watts = watts;
    }

    public boolean isRgb() {
        return rgb;
    }

    public void setRgb(boolean rgb) {
        this.rgb = rgb;
    }

    public boolean isVariable_temperature() {
        return variable_temperature;
    }

    public void setVariable_temperature(boolean variableTempreture) {
        this.variable_temperature = variableTempreture;
    }
}

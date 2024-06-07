package at.camconnect.model.DeviceTypeVariants;

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

    public LightType() {
        super();
        setVariant(DeviceTypeVariantEnum.light);
    }

    public LightType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, int watts, boolean rgb, boolean variable_temperature) {
        super(type_id, creation_date, name, image, status, variant);
        this.watts = watts;
        this.rgb = rgb;
        this.variable_temperature = variable_temperature;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setRgb(data.rgb());
            setWatts(data.watts());
            setVariable_temperature(data.variable_temperature());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%b;%b;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getWatts(), isRgb(), isVariable_temperature());
    }

    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s; ; ; ; ; ; ; ; ; ;%d;%b;%b; ; ; ; ; ; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getWatts(),
                isRgb(),
                isVariable_temperature()
        );
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

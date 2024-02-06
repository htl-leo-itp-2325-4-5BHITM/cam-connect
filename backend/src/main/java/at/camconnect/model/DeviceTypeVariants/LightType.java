package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;

@Entity
public class LightType extends DeviceType {
    private int watts;
    private boolean rgb;
    private boolean variable_temperature;

    public LightType(String typeName, int watts, boolean rgb, boolean variable_temperature) {
        super(typeName);
        this.watts = watts;
        this.rgb = rgb;
        this.variable_temperature = variable_temperature;
    }

    @Override
    public void update(DeviceTypeGlobal data) {
        try{
            setRgb(data.rgb());
            setWatts(data.watts());
            setVariable_temperature(data.variable_temperature());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public LightType() {
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

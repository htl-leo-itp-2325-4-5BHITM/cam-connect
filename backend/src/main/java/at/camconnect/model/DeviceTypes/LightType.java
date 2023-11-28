package at.camconnect.model.DeviceTypes;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.DeviceType;
import jakarta.json.JsonObject;
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

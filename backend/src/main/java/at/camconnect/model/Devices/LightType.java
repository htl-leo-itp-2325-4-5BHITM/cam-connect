package at.camconnect.model.Devices;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class LightType extends DeviceType {
    private int watts;
    private boolean rgb;
    private boolean variableTempreture;

    public LightType(String typeName, long typeId, int watts, boolean rgb, boolean variableTempreture) {
        super(typeName, typeId);
        this.watts = watts;
        this.rgb = rgb;
        this.variableTempreture = variableTempreture;
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

    public boolean isVariableTempreture() {
        return variableTempreture;
    }

    public void setVariableTempreture(boolean variableTempreture) {
        this.variableTempreture = variableTempreture;
    }
}

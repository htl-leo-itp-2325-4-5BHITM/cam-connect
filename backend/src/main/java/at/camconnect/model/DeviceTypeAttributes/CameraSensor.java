package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.*;

@Entity
public class CameraSensor extends DeviceTypeAttribute {
    private String size;

    public CameraSensor(String name, String size, String details) {
        super(name, details);
        this.size = size;
    }

    public CameraSensor() {
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}

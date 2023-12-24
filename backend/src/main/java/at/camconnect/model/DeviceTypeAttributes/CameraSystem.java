package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.Entity;

@Entity
public class CameraSystem extends DeviceTypeAttribute {
    public CameraSystem(String name, String details) {
        super(name, details);
    }

    public CameraSystem() {
    }
}

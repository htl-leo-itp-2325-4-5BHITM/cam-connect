package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.*;

@Entity
public class LensMount extends DeviceTypeAttribute {
    public LensMount(String name, String details) {
        super(name, details);
    }

    public LensMount() {
    }
}

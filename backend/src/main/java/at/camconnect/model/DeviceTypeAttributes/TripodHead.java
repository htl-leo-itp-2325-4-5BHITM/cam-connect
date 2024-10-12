package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.dtos.DeviceTypeAttributeDTO;
import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.*;

@Entity
public class TripodHead extends DeviceTypeAttribute {
    public TripodHead(String name, String details) {
        super(name, details);
    }

    public TripodHead() {
    }

    @Override
    public void update(DeviceTypeAttributeDTO data) {
        setName(data.name());
        setDetails(data.details());
    }
}

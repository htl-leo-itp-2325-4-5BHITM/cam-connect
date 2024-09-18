package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.dtos.DeviceTypeAttributeDTO;
import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class AudioConnector extends DeviceTypeAttribute {
    public AudioConnector(String name, String details) {
        super(name, details);
    }

    public AudioConnector() {
    }

    @Override
    public void update(DeviceTypeAttributeDTO data) {
        setName(data.name());
        setDetails(data.details());
    }
}

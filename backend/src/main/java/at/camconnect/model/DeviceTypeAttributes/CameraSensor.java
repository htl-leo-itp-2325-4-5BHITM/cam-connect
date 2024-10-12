package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.dtos.DeviceTypeAttributeDTO;
import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.*;

@Deprecated
@Entity
public class CameraSensor extends DeviceTypeAttribute {
    @Column(length = 50)
    private String size;

    public CameraSensor(String name, String size, String details) {
        super(name, details);
        this.size = size;
    }

    public CameraSensor() {
    }

    @Override
    public void update(DeviceTypeAttributeDTO data) {
        setSize(data.size());
        setName(data.name());
        setDetails(data.details());
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}

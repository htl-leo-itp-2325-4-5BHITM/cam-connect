package at.camconnect.model;

import at.camconnect.dtos.DeviceTypeAttributeDTO;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class DeviceTypeAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "attribute_name")
    private long attribute_id;
    private String name;
    private String details;

    public DeviceTypeAttribute(String name, String details) {
        this.name = name;
        this.details = details;
    }

    public DeviceTypeAttribute() {
    }

    abstract public void update(DeviceTypeAttributeDTO data);

    public long getAttribute_id() {
        return attribute_id;
    }

    public void setAttribute_id(long attribute_id) {
        this.attribute_id = attribute_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}

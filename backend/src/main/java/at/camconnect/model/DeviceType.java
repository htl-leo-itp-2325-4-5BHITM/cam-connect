package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class DeviceType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "device_type_seq")
    @SequenceGenerator(name = "device_type_seq", sequenceName = "DEVICE_TYPE_SEQ", allocationSize = 1)
    private Long type_id;
    private String name;

    public DeviceType(String name) {
        this.name = name;
    }

    public DeviceType() {
    }

    //region Getter und Setter
    public String getName() {
        return name;
    }

    public void setName(String typeName) {
        this.name = typeName;
    }

    public long getType_id() {
        return type_id;
    }

    public void setType_id(long typeId) {
        this.type_id = typeId;
    }
    //endregion
}

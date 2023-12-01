package at.camconnect.model;

import jakarta.json.JsonObject;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class DeviceType{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "device_type_seq")
    @SequenceGenerator(name = "device_type_seq", sequenceName = "DEVICE_TYPE_SEQ", allocationSize = 1)
    private Long type_id;
    private String name;


    private String image;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

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

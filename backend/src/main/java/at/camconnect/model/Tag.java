package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Tag {
    @Id
    @GeneratedValue
    private long tag_id;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private DeviceType type;

    private String descreption;

    public Tag(long tag_Id, DeviceType type, String descreption) {
        this.tag_id = tag_Id;
        this.type = type;
        this.descreption = descreption;
    }

    public Tag() {
    }

    public long getTag_id() {
        return tag_id;
    }

    public void setTag_id(long tag_Id) {
        this.tag_id = tag_Id;
    }

    public DeviceType getType() {
        return type;
    }

    public void setType(DeviceType type) {
        this.type = type;
    }

    public String getDescreption() {
        return descreption;
    }

    public void setDescreption(String descreption) {
        this.descreption = descreption;
    }
}

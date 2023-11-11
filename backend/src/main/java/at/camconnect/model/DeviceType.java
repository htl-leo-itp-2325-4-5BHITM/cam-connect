package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class DeviceType {
    @Id
    @GeneratedValue
    private long type_Id;

    //@OneToMany(cascade = CascadeType.ALL, mappedBy = "tag_id", fetch = FetchType.EAGER)
    //private List<Tag> tags;
    private String typeName;

    public DeviceType(String typeName, long typeId) {
        this.typeName = typeName;
        this.type_Id = typeId;
    }

    public DeviceType() {
    }

    //<editor-fold desc="Getter und Setter">
    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public long getType_Id() {
        return type_Id;
    }

    public void setType_Id(long typeId) {
        this.type_Id = typeId;
    }
    //</editor-fold>
}

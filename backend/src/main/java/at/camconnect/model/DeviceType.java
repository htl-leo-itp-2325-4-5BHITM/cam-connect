package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class DeviceType {
    @Id
    @GeneratedValue
    private long type_Id;

    //@OneToMany(cascade = CascadeType.ALL, mappedBy = "tag_id", fetch = FetchType.EAGER)
    //private List<Tag> tags;
    private String name;

    public DeviceType(String name, long typeId) {
        this.name = name;
        this.type_Id = typeId;
    }

    public DeviceType() {
    }

    //<editor-fold desc="Getter und Setter">
    public String getName() {
        return name;
    }

    public void setName(String typeName) {
        this.name = typeName;
    }

    public long getType_Id() {
        return type_Id;
    }

    public void setType_Id(long typeId) {
        this.type_Id = typeId;
    }
    //</editor-fold>
}

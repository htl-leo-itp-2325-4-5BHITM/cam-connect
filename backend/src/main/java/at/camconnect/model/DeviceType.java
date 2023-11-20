package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class DeviceType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "device_type_seq")
    @SequenceGenerator(name = "device_type_seq", sequenceName = "DEVICE_TPYE_SEQ", allocationSize = 1)
    private Long type_id;

    //@OneToMany(cascade = CascadeType.ALL, mappedBy = "tag_id", fetch = FetchType.EAGER)
    //private List<Tag> tags;
    private String name;

    public DeviceType(String name, long typeId) {
        this.name = name;
        this.type_id = typeId;
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

    public long getType_id() {
        return type_id;
    }

    public void setType_id(long typeId) {
        this.type_id = typeId;
    }
    //</editor-fold>
}

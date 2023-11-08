package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class DeviceType {
    @Id
    @GeneratedValue
    private long tagId;
    private long typeId;
    private String typeName;


    public DeviceType(String typeName, long typeId) {
        this.typeName = typeName;
        this.typeId = typeId;
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

    public long getTypeId() {
        return typeId;
    }

    public void setTypeId(long typeId) {
        this.typeId = typeId;
    }
    //</editor-fold>
}

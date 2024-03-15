package at.camconnect.model;

import at.camconnect.dtos.DeviceTypeGlobalObjectsDTO;
import at.camconnect.dtos.DeviceTypeDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import jakarta.json.JsonObject;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class DeviceType{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long type_id;

    @Enumerated(EnumType.STRING)
    private DeviceTypeVariantEnum variant;
    private String name;
    private String image;

    abstract public void update(DeviceTypeGlobalObjectsDTO data);

    public void setType_id(Long type_id) {
        this.type_id = type_id;
    }

    public DeviceTypeVariantEnum getVariant() {
        return variant;
    }

    public void setVariant(DeviceTypeVariantEnum variant) {
        this.variant = variant;
    }

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

    public DeviceType(Long type_id, DeviceTypeVariantEnum variant, String name, String image) {
        this.type_id = type_id;
        this.variant = variant;
        this.name = name;
        this.image = image;
    }

    //endregion
}

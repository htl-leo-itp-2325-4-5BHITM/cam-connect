package at.camconnect.model;

import at.camconnect.dtos.deviceType.DeviceTypeFullDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//no fucking clue why this is needed, I randomly got the most cryptic error when changing the status of rent to
//enumeration type string and corrected the inserts so i asked copilot and it told me to do this
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public abstract class DeviceType{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long type_id;

    @Enumerated(EnumType.STRING)
    private DeviceTypeVariantEnum variant;

    @Enumerated(EnumType.STRING)
    private DeviceTypeStatusEnum status;

    @Column(length = 20, unique = true)
    private String name;

    private String image;

    private LocalDateTime creation_date;
    private LocalDateTime change_date;

    public DeviceType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant) {
        this.variant = variant;
        this.status = status;
        this.name = name;
        this.image = image;
        this.creation_date = creation_date;
    }

    abstract public void update(DeviceTypeGlobalObjectsDTO data);

    public DeviceTypeStatusEnum getStatus() {
        return status;
    }

    public void setStatus(DeviceTypeStatusEnum status) {
        this.status = status;
    }

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
        setStatus(DeviceTypeStatusEnum.active);
        this.name = name;
        this.creation_date = LocalDateTime.now();
    }

    public DeviceType() {
        this.creation_date = LocalDateTime.now();
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

    public LocalDateTime getCreation_date() {
        return creation_date;
    }

    /**
     * this function is used for the full export of all device types in one file
     * @return
     */
    public abstract String getFullExportString();

    public abstract DeviceTypeGlobalIdDTO toGlobalDTO();
    //endregion
}

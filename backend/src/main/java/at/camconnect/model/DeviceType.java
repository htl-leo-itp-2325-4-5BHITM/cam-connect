package at.camconnect.model;

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

    private String image_blob_url;

    private final LocalDateTime creation_date;
    private LocalDateTime change_date;

    public DeviceType(String name, String image_blob_url, DeviceTypeVariantEnum variant) {
        this();
        this.variant = variant;
        this.status = DeviceTypeStatusEnum.active;
        this.name = name;
        this.image_blob_url = image_blob_url;
    }

    public DeviceType(String name) {
        this();
        setStatus(DeviceTypeStatusEnum.active);
        this.name = name;
    }

    public DeviceType(){
        updateChangeDate();
        this.creation_date = LocalDateTime.now();
    }

    public void updateChangeDate(){
        this.change_date = LocalDateTime.now();
    }

    abstract public void update(DeviceTypeGlobalObjectsDTO data);

    public abstract DeviceTypeGlobalIdDTO toGlobalDTO();

    //getter setter

    public DeviceTypeStatusEnum getStatus() {
        return status;
    }

    public void setStatus(DeviceTypeStatusEnum status) {
        this.status = status;
        this.updateChangeDate();
    }

    public DeviceTypeVariantEnum getVariant() {
        return variant;
    }

    public void setVariant(DeviceTypeVariantEnum variant) {
        this.variant = variant;
        this.updateChangeDate();
    }

    public String getImage_blob_url() {
        return image_blob_url;
    }

    public void setImage_blob_url(String image) {
        this.image_blob_url = image;
        this.updateChangeDate();
    }

    public LocalDateTime getChange_date() {
        return change_date;
    }

    public LocalDateTime getCreation_date() {
        return creation_date;
    }


    public String getName() {
        return name;
    }

    public void setName(String typeName) {
        this.name = typeName;
        this.updateChangeDate();
    }

    public Long getType_id() {
        return type_id;
    }
}

package at.camconnect.model;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.responseSystem.CCException;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(length = 50)
    private String name;

    private String image_blob;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Tag> tags;

    private final LocalDateTime creation_date;
    private LocalDateTime change_date;

    public DeviceType(String name, String image_blob, DeviceTypeVariantEnum variant) {
        this();
        this.variant = variant;
        this.status = DeviceTypeStatusEnum.active;
        this.name = name;
        this.image_blob = image_blob;
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

    @Override
    public String toString() {
        return "DeviceType{" +
                "type_id=" + type_id +
                ", variant=" + variant +
                ", status=" + status +
                ", name='" + name + '\'' +
                ", image_blob='" + image_blob + '\'' +
                ", creation_date=" + creation_date +
                ", change_date=" + change_date +
                '}';
    }

    public void updateChangeDate(){
        this.change_date = LocalDateTime.now();
    }

    public void update(DeviceTypeGlobalObjectsDTO data){
        try{
            setName(data.name());
            setImage_blob(data.image());
            setChange_date(LocalDateTime.now());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    };

    public void setChange_date(LocalDateTime change_date) {
        this.change_date = change_date;
    }

    public abstract DeviceTypeGlobalIdDTO toGlobalDTO();

    public abstract List<DeviceTypeAttribute> getAttributes();

    //getter setter
    public List<Tag> getTags() {
        return tags;
    }

    public void toggleTag(Tag tag) {
        if (tags.contains(tag)) {
            tags.remove(tag);
        } else {
            tags.add(tag);
        }
    }


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

    public String getImage_blob() {
        return image_blob;
    }

    public void setImage_blob(String image) {
        this.image_blob = image;
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

package at.camconnect.model;

import at.camconnect.enums.DeviceStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class DeviceSet {
    @Column(length = 20)
    private String name;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long id;

    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<DeviceType> device_types;

    @Enumerated(EnumType.STRING)
    private DeviceStatus status;

    private String image_blob;

    private LocalDateTime creation_date;
    private LocalDateTime change_date;

    public DeviceSet(String name, String description, DeviceStatus status) {
        this.name = name;
        this.description = description;
        this.status = status;
    }

    public DeviceSet() {
    }

    //region Getter and Setter

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public List<DeviceType> getDevice_types() {
        return device_types;
    }

    public void addDevice_type(DeviceType device_type) {
        this.device_types.add(device_type);
    }

    public void removeDevice_type(DeviceType device_type) {
        this.device_types.remove(device_type);
    }

    public void setDevice_types(List<DeviceType> device_types) {
        this.device_types = device_types;
    }

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }

    public String getImage_blob() {
        return image_blob;
    }

    public void setImage_blob(String image_blob) {
        this.image_blob = image_blob;
    }

    public LocalDateTime getCreation_date() {
        return creation_date;
    }

    public void setCreation_date(LocalDateTime creation_date) {
        this.creation_date = creation_date;
    }

    public LocalDateTime getChange_date() {
        return change_date;
    }

    public void setChange_date(LocalDateTime change_date) {
        this.change_date = change_date;
    }
    //endregion
}
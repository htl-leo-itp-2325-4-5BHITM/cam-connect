package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class DeviceSet {

    private String name;
    @Id
    private Long id;

    @OneToMany(fetch = FetchType.EAGER)
    private
    List<DeviceType> device_types;

    public DeviceSet(String name) {
        this.name = name;
    }

    public DeviceSet() {
    }

    //region Getter and Setter
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
    //endregion
}

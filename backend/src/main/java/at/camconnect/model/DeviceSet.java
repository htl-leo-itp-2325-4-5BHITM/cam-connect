package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class DeviceSet {

    private String name;
    @Id
    private Long id;

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
    //endregion
}

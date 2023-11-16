package at.camconnect.model.Devices.subtypes;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LensMount {
    @Id
    private long mount_id;

    private String name;

    public LensMount(long mount_id, String name) {
        this.mount_id = mount_id;
        this.name = name;
    }

    public LensMount() {
    }

    public long getMount_id() {
        return mount_id;
    }

    public void setMount_id(long mount_id) {
        this.mount_id = mount_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

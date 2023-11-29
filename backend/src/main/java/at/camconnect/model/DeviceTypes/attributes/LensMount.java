package at.camconnect.model.DeviceTypes.attributes;

import at.camconnect.model.DeviceTypes.CameraType;
import at.camconnect.model.DeviceTypes.LensType;
import jakarta.persistence.*;

@Entity
public class LensMount {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lens_mount_seq")
    @SequenceGenerator(name = "lens_mount_seq", sequenceName = "LENS_MOUNT_SEQ", allocationSize = 1)
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

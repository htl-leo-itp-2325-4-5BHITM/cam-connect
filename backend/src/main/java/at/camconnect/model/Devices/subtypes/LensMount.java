package at.camconnect.model.Devices.subtypes;

import at.camconnect.model.Devices.CameraType;
import at.camconnect.model.Devices.LensType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class LensMount {
    @Id
    private long mount_id;

    private String name;

    @ManyToOne
    private LensType lensType;

    @ManyToOne
    private CameraType cameraType;

    public LensMount(long mount_id, String name, LensType lensType, CameraType cameraType) {
        this.mount_id = mount_id;
        this.name = name;
        this.lensType = lensType;
        this.cameraType = cameraType;
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

    public LensType getLensType() {
        return lensType;
    }

    public void setLensType(LensType lensType) {
        this.lensType = lensType;
    }

    public CameraType getCameraType() {
        return cameraType;
    }

    public void setCameraType(CameraType cameraType) {
        this.cameraType = cameraType;
    }
}

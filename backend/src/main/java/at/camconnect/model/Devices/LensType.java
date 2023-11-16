package at.camconnect.model.Devices;

import at.camconnect.model.DeviceType;
import at.camconnect.model.Devices.subtypes.LensMount;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LensType extends DeviceType {
    private String fStop;
    private String mount;
    private int focalLength;

    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount lensMount;

    public LensType(String typeName, long typeId, String fStop, String mount, int focalLength) {
        super(typeName, typeId);
        this.fStop = fStop;
        this.mount = mount;
        this.focalLength = focalLength;
    }

    public LensType() {
    }

    public String getfStop() {
        return fStop;
    }

    public void setfStop(String fStop) {
        this.fStop = fStop;
    }

    public String getMount() {
        return mount;
    }

    public void setMount(String mount) {
        this.mount = mount;
    }

    public int getFocalLength() {
        return focalLength;
    }

    public void setFocalLength(int focalLength) {
        this.focalLength = focalLength;
    }
}

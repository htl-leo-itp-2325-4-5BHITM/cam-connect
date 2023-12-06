package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.attributes.LensMount;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LensType extends DeviceType {
    private double f_stop;
    private int focal_length;

    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount lens_mount;

    public LensType(String typeName, double f_stop, LensMount lens_mount, int focal_length) {
        super(typeName);
        this.f_stop = f_stop;
        this.lens_mount = lens_mount;
        this.focal_length = focal_length;
    }

    public LensType() {
    }

    //region getter setter
    public double getF_stop() {
        return f_stop;
    }

    public void setF_stop(double f_stop) {
        this.f_stop = f_stop;
    }

    public int getFocal_length() {
        return focal_length;
    }

    public void setFocal_length(int focal_length) {
        this.focal_length = focal_length;
    }

    public LensMount getLens_mount() {
        return lens_mount;
    }

    public void setLens_mount(LensMount lens_mount) {
        this.lens_mount = lens_mount;
    }

    //endregion
}

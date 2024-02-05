package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.LensMount;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LensType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "mount_id")
    private LensMount lens_mount;
    private double f_stop;
    private int focal_length;

    public LensType(String typeName, double f_stop, LensMount lens_mount, int focal_length) {
        super(typeName);
        this.f_stop = f_stop;
        this.lens_mount = lens_mount;
        this.focal_length = focal_length;
    }

    @Override
    public void update(DeviceTypeGlobal data) {
        try{
            setF_stop(data.f_stop());
            setFocal_length(data.focal_length());
            setLens_mount(data.mount());
        }catch (Exception ex){
            throw new CCException(1106);
        }
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

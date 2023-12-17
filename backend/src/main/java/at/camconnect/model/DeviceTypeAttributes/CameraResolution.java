package at.camconnect.model.DeviceTypeAttributes;

import at.camconnect.model.DeviceTypeAttribute;
import jakarta.persistence.*;

@Entity
public class CameraResolution extends DeviceTypeAttribute {
    private String resolution;

    public CameraResolution(String name, String resolution, String details) {
        super(name, details);
        this.resolution = resolution;
    }

    public CameraResolution() {
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }
}

package at.camconnect.model.DeviceTypes.attributes;

import at.camconnect.model.DeviceTypes.CameraType;
import at.camconnect.model.DeviceTypes.DroneType;
import jakarta.persistence.*;

@Entity
public class CameraResolution {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "camera_resolution_seq")
    @SequenceGenerator(name = "camera_resolution_seq", sequenceName = "CAMERA_RESOLUTION_SEQ", allocationSize = 1)
    private long resolution_id;

    private String name;

    private String details;

    @ManyToOne
    private CameraType cameraType;

    @ManyToOne
    private DroneType droneType;

    public CameraResolution(long resolution_id, String name, String details, CameraType cameraType, DroneType droneType) {
        this.resolution_id = resolution_id;
        this.name = name;
        this.details = details;
        this.cameraType = cameraType;
        this.droneType = droneType;
    }

    public CameraResolution() {
    }

    public long getResolution_id() {
        return resolution_id;
    }

    public void setResolution_id(long resolution_id) {
        this.resolution_id = resolution_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public CameraType getCameraType() {
        return cameraType;
    }

    public void setCameraType(CameraType cameraType) {
        this.cameraType = cameraType;
    }

    public DroneType getDroneType() {
        return droneType;
    }

    public void setDroneType(DroneType droneType) {
        this.droneType = droneType;
    }
}

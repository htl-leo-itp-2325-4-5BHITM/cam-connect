package at.camconnect.model.DeviceTypes.attributes;

import at.camconnect.model.DeviceTypes.CameraType;
import at.camconnect.model.DeviceTypes.DroneType;
import jakarta.persistence.*;

@Entity
public class CameraSensor {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "camera_sensor_seq")
    @SequenceGenerator(name = "camera_sensor_seq", sequenceName = "CAMERA_SENSOR_SEQ", allocationSize = 1)
    private long sensor_id;

    private String name;

    @ManyToOne
    private CameraType cameraType;

    @ManyToOne
    private DroneType droneType;

    public CameraSensor(long sensor_id, String name, CameraType cameraType, DroneType droneType) {
        this.sensor_id = sensor_id;
        this.name = name;
        this.cameraType = cameraType;
        this.droneType = droneType;
    }

    public CameraSensor() {
    }

    public long getSensor_id() {
        return sensor_id;
    }

    public void setSensor_id(long sensor_id) {
        this.sensor_id = sensor_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

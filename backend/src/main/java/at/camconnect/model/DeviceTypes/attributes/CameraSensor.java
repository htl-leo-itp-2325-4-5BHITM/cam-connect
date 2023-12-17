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

    public CameraSensor(long sensor_id, String name) {
        this.sensor_id = sensor_id;
        this.name = name;
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
}

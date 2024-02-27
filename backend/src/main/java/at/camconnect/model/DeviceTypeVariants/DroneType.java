package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobal;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DroneType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private CameraSensor sensor;
    @ManyToOne
    @JoinColumn(name = "resolution_id")
    private CameraResolution resolution;
    private int max_range;

    public DroneType() {
        setVariant(DeviceTypeEnum.drone);
    }

    public DroneType(String typeName, CameraSensor sensor, CameraResolution resolution, int max_range) {
        super(typeName);
        this.sensor = sensor;
        this.resolution = resolution;
        this.max_range = max_range;
    }

    @Override
    public void update(DeviceTypeGlobal data) {
        try{
            setMax_range(data.max_range());
            setSensor(data.sensor());
            setResolution(data.resolution());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public CameraSensor getSensor() {
        return sensor;
    }

    public void setSensor(CameraSensor sensor) {
        this.sensor = sensor;
    }

    public CameraResolution getResolution() {
        return resolution;
    }

    public void setResolution(CameraResolution resolution) {
        this.resolution = resolution;
    }

    public int getMax_range() {
        return max_range;
    }

    public void setMax_range(int maxRange) {
        this.max_range = maxRange;
    }
}

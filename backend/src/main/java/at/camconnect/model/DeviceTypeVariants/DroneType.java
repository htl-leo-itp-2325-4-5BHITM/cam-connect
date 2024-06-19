package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.CameraResolution;
import at.camconnect.model.DeviceTypeAttributes.CameraSensor;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class DroneType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private CameraSensor sensor;
    @ManyToOne
    @JoinColumn(name = "resolution_id")
    private CameraResolution resolution;
    @Column(length = 5)
    private int max_range_kilometers;
    private int flight_time_minutes;

    public DroneType() {
        super();
        setVariant(DeviceTypeVariantEnum.drone);
    }

    public DroneType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, CameraSensor sensor, CameraResolution resolution, int max_range_kilometers, int flight_time_minutes) {
        super(type_id, creation_date, name, image, status, variant);
        this.sensor = sensor;
        this.resolution = resolution;
        this.max_range_kilometers = max_range_kilometers;
        this.flight_time_minutes = flight_time_minutes;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setMax_range_kilometers(data.max_range());
            setSensor(data.sensor());
            setResolution(data.resolution());
            setFlight_time_minutes(data.flight_time_minutes());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%d;%d;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getSensor() != null ? getSensor().getAttribute_id() : null,
                getResolution() != null ? getResolution().getAttribute_id() : null,
                getMax_range_kilometers());
    }


    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%d; ; ; ; ;%d; ; ; ; ; ; ; ; ; ; ; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getSensor() != null ? getSensor().getAttribute_id() : null,
                getResolution() != null ? getResolution().getAttribute_id() : null,
                getMax_range_kilometers()
        );
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getImage(), sensor.getAttribute_id(), resolution.getAttribute_id(), flight_time_minutes, max_range_kilometers);
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

    public int getMax_range_kilometers() {
        return max_range_kilometers;
    }

    public void setMax_range_kilometers(int maxRange) {
        this.max_range_kilometers = maxRange;
    }

    public int getFlight_time_minutes() {
        return flight_time_minutes;
    }

    public void setFlight_time_minutes(int flight_time) {
        this.flight_time_minutes = flight_time;
    }
}

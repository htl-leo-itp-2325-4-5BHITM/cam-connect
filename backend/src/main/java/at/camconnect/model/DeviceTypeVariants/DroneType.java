package at.camconnect.model.DeviceTypeVariants;

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
    private int max_range;

    public DroneType() {
        super();
        setVariant(DeviceTypeVariantEnum.drone);
    }

    public DroneType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, CameraSensor sensor, CameraResolution resolution, int max_range) {
        super(type_id, creation_date, name, image, status, variant);
        this.sensor = sensor;
        this.resolution = resolution;
        this.max_range = max_range;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setMax_range(data.max_range());
            setSensor(data.sensor());
            setResolution(data.resolution());
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
                getMax_range());
    }


    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s;%d;%d; ; ; ; ;%d; ; ; ; ; ; ; ; ; ; ; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getSensor() != null ? getSensor().getAttribute_id() : null,
                getResolution() != null ? getResolution().getAttribute_id() : null,
                getMax_range()
        );
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

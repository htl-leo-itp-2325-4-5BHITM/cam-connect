package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class DroneType extends DeviceType {
    @Column(length = 5)
    private int max_range_kilometers;
    private int flight_time_minutes;
    boolean requires_license;


    public DroneType(String name, String image, int max_range_kilometers, int flight_time_minutes, boolean requires_license) {
        super(name, image, DeviceTypeVariantEnum.drone);
        this.max_range_kilometers = max_range_kilometers;
        this.flight_time_minutes = flight_time_minutes;
        this.requires_license = requires_license;
    }

    public DroneType() {
        super();
        setVariant(DeviceTypeVariantEnum.drone);
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setName(data.name());
            setImage_blob_url(data.image());
            setMax_range_kilometers(data.max_range());
            setFlight_time_minutes(data.flight_time_minutes());
            setRequires_license(data.requires_license());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return "todo";
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return null;
    }

    public boolean isRequires_license() {
        return requires_license;
    }

    public void setRequires_license(boolean requiresLicense) {
        this.requires_license = requiresLicense;
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

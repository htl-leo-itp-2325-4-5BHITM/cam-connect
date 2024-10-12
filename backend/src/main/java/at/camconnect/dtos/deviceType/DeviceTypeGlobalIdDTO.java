package at.camconnect.dtos.deviceType;

public record DeviceTypeGlobalIdDTO(
        Long type_id,
        String name,
        String image,
        boolean autofocus,
        String f_stop,
        String focal_length,
        int height_centimeters,
        double max_weight_kilograms,
        int max_range,
        int flight_time,
        boolean requires_license,
        boolean needs_recorder,
        boolean needs_power,
        int number_of_axis,
        boolean rgb,
        boolean variable_temperature,
        int watts,
        Long connector_id,
        Long head_id,
        Long mount_id,
        Long system_id,
        Long photo_resolution_id,
        String description
    )
{
    public DeviceTypeGlobalIdDTO {
    }

    /**
     * For CameraType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean autofocus, Long mount_id, Long photo_resolution_id, Long system_id) {
        this(type_id, name, image, autofocus, "", "", 0, 0, 0, 0, false, false, false, 0, false, false, 0, null, null, mount_id, system_id, photo_resolution_id, "");
    }

    /**
     * For DroneType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, Long sensor_id, int flight_time, int max_range) {
        this(type_id, name, image, false, "", "", 0, max_range, 0, 0, false, false, false, 0, false, false, 0, null, sensor_id, null, null, null, "");
    }

    /**
     * For LensType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, String f_stop, String focal_length, Long mount_id) {
        this(type_id, name, image, false, f_stop, focal_length, 0, 0, 0, 0, false, false, false, 0, false, false, 0, null, mount_id, null, null, null, "");
    }

    /**
     * For LightType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean rgb, boolean variable_temperature, int watts) {
            this(type_id, name, image, false, "", "", 0, 0, 0, 0, false, false, false, 0, rgb, variable_temperature, watts, null, null, null, null, null, "");
    }

    /**
     * For MicrophoneType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean needs_recorder, Long connector_id, boolean needs_power) {
        this(type_id, name, image, false, "", "", 0, 0, 0, 0, false, needs_recorder, needs_power, 0, false, false, 0, connector_id, null, null, null, null, "");
    }

    /**
     * For SimpleType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String description, String image) {
        this(type_id, name, image, false, "", "", 0, 0, 0, 0, false, false, false, 0, false, false, 0, null, null, null, null, null, description);
    }

    /**
     * For StabilizerType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, double max_weight_kilograms, int number_of_axis) {
        this(type_id, name, image, false, "", "", 0, max_weight_kilograms, 0, 0, false, false, false, number_of_axis, false, false, 0, null, null, null, null, null, "");
    }

    /**
     * For TripodType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, int height_centimeters, Long head_id) {
        this(type_id, name, image, false, "", "", height_centimeters, 0, 0, 0, false, false, false, 0, false, false, 0, null, head_id, null, null, null, "");
    }

    /**
     * For AudioType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, Long connector_id) {
        this(type_id, name, image, false, "", "", 0, 0, 0, 0, false, false, false, 0, false, false, 0, connector_id, null, null, null, null, "");
    }

    public String toCsvString(){
        return type_id + ";" + name + ";" + image + ";" + autofocus + ";" + f_stop + ";" + focal_length + ";" + height_centimeters + ";" + max_weight_kilograms + ";" + max_range + ";" + flight_time + ";" + requires_license + ";" + needs_recorder + ";" + needs_power + ";" + number_of_axis + ";" + rgb + ";" + variable_temperature + ";" + watts + ";" + connector_id + ";" + head_id + ";" + mount_id + ";" + system_id + ";" + photo_resolution_id + ";" + description + "\n";
    }
}

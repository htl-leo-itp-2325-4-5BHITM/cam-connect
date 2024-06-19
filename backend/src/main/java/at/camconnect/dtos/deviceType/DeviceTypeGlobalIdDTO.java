package at.camconnect.dtos.deviceType;

public record DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean autofocus, String f_stop, String focal_length, int height_centimeters, int max_range, double max_weight_kilograms, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, Long head_id, Long mount_id, Long resolution_id, Long sensor_id, Long system_id, int flight_time, String description) {

    public DeviceTypeGlobalIdDTO {
    }

    /**
     * For CameraType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean autofocus, Long mount_id, Long resolution_id, Long sensor_id, Long system_id) {
        this(type_id, name, image, autofocus, "", "", 0, 0, 0, false, 0, false, false, 0, false, false, null, mount_id, resolution_id, sensor_id, system_id, 0, "");
    }

    /**
     * For DroneType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, Long sensor_id, Long resolution_id, int flight_time, int max_range) {
        this(type_id, name, image, false, "", "", 0, max_range, 0, false, 0, false, false, 0, false, false, null, null, resolution_id, sensor_id, null, flight_time, "");
    }

    /**
     * For LensType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, String f_stop, String focal_length, Long mount_id) {
        this(type_id, name, image, false, f_stop, focal_length, 0, 0, 0, false, 0, false, false, 0, false, false, null, mount_id, null, null, null, 0, "");
    }

    /**
     * For LightType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean rgb, boolean variable_temperature, int watts) {
        this(type_id, name, image,false, "", "", 0, 0, 0, false, 0, rgb, variable_temperature, watts, false, false, null, null, null, null, null, 0,  "");
    }

    /**
     * For MicrophoneType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, boolean needsrecorder, boolean wireless, boolean windblocker) {
        this(type_id, name, image, false, "", "", 0, 0, 0, needsrecorder, 0, false, false, 0, windblocker, wireless, null, null, null, null, null, 0, "");
    }

    /**
     * For SimpleType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String description, String image) {
        this(type_id, name, image, false, "", "", 0, 0, 0, false, 0, false, false, 0, false, false, null, null, null, null, null, 0, description);
    }

    /**
     * For StabilizerType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, double max_weight_kilograms, int number_of_axis) {
        this(type_id, name, image, false, "", "", 0, 0, max_weight_kilograms, false, number_of_axis, false, false, 0, false, false, null, null, null, null, null, 0, "");
    }

    /**
     * For TripodType
     */
    public DeviceTypeGlobalIdDTO(Long type_id, String name, String image, int height_centimeters, Long head_id) {
        this(type_id, name, image,false, "", "", height_centimeters, 0, 0, false, 0, false, false, 0, false, false, head_id, null, null, null, null, 0, "");
    }

    public String toCsvString(){
        return type_id + ";" + name + ";" + image + ";" + autofocus + ";" + f_stop + ";" + focal_length + ";" + height_centimeters + ";" + max_range + ";" + max_weight_kilograms + ";" + needsrecorder + ";" + number_of_axis + ";" + rgb + ";" + variable_temperature + ";" + watts + ";" + windblocker + ";" + wireless + ";" + head_id + ";" + mount_id + ";" + resolution_id + ";" + sensor_id + ";" + system_id + ";" + flight_time + ";" + description + "\n";
    }
}

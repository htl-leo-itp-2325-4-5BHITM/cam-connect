package at.camconnect.dtos;

import at.camconnect.enums.DeviceTypeVariantEnum;

public record DeviceTypeDTO(boolean autofocus, DeviceTypeVariantEnum variant, String f_stop, String focal_length, int framerate, int height_centimeters, int max_range, double max_weight_kilograms, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, Long head_id, Long mount_id, Long resolution_id, Long sensor_id, Long system_id, int type_id, String dtype, String image, String name) {
}

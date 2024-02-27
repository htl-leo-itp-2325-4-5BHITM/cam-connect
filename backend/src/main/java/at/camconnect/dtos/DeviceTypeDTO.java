package at.camconnect.dtos;

import at.camconnect.enums.DeviceTypeVariantEnum;

public record DeviceTypeDTO(boolean autofocus, DeviceTypeVariantEnum variant, double f_stop, int focal_length, int framerate, int height, int max_range, int max_weight, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, Long head_id, Long mount_id, Long resolution_id, Long sensor_id, Long system_id, int type_id, String dtype, String image, String name) {
}

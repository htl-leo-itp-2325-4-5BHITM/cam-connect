package at.camconnect.dtos.deviceType;

import at.camconnect.model.DeviceTypeAttributes.*;

public record DeviceTypeGlobalObjectsDTO(Long type_id, String image, String name, boolean autofocus, String f_stop, String focal_length, int height_centimeters, int max_range, double max_weight_kilograms, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, TripodHead head, LensMount mount, CameraResolution resolution, CameraSensor sensor, CameraSystem system, int flight_time_minutes, String description) {
}

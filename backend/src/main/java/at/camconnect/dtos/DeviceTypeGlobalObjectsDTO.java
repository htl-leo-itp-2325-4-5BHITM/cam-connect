package at.camconnect.dtos;

import at.camconnect.model.DeviceTypeAttributes.*;

public record DeviceTypeGlobalObjectsDTO(boolean autofocus, String f_stop, String focal_length, int framerate, int height_centimeters, int max_range, double max_weight_kilograms, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, TripodHead head, LensMount mount, CameraResolution resolution, CameraSensor sensor, CameraSystem system, int type_id, String dtype, String image, String name, String description) {
}

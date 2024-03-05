package at.camconnect.dtos;

import at.camconnect.model.DeviceTypeAttributes.*;

public record DeviceTypeGlobalObjectsDTO(boolean autofocus, double f_stop, int focal_length, int framerate, int height, int max_range, int max_weight, boolean needsrecorder, int number_of_axis, boolean rgb, boolean variable_temperature, int watts, boolean windblocker, boolean wireless, TripodHead head, LensMount mount, CameraResolution resolution, CameraSensor sensor, CameraSystem system, int type_id, String dtype, String image, String name, String description) {
}

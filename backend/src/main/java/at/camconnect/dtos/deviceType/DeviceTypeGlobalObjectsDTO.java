package at.camconnect.dtos.deviceType;

import at.camconnect.model.DeviceTypeAttributes.*;

public record DeviceTypeGlobalObjectsDTO(
    Long type_id,
    String name,
    String image,
    boolean autofocus,
    String f_stop,
    String focal_length,
    int height_centimeters,
    double max_weight_kilograms,
    int max_range,
    int flight_time_minutes,
    boolean requires_license,
    boolean needs_recorder,
    boolean needs_power,
    int number_of_axis,
    boolean rgb,
    boolean variable_temperature,
    int watts,
    AudioConnector connector,
    TripodHead head,
    LensMount mount,
    CameraSystem system,
    CameraResolution photo_resolution,
    String description
) { }

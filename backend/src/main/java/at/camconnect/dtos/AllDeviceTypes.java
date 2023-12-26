package at.camconnect.dtos;

import at.camconnect.model.DeviceTypes.CameraType;
import at.camconnect.model.DeviceTypes.DroneType;

import java.util.List;

public record AllDeviceTypes(List<CameraType> cameraTypes, List<DroneType> droneTypes) {
}

package at.camconnect.dtos.deviceType;

import at.camconnect.model.DeviceTypeVariants.*;

import java.util.List;

public record DeviceTypeCollection(List<CameraType> cameraTypes, List<DroneType> droneTypes, List<LensType> lensTypes, List<LightType> lightTypes, List<MicrophoneType> microphoneTypes, List<StabilizerType> stabilizerTypes, List<TripodType> tripodTypes, List<AudioType> audioTypes) {
}

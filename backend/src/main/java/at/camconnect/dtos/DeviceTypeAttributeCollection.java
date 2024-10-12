package at.camconnect.dtos;

import at.camconnect.model.DeviceTypeAttributes.*;

import java.util.List;

public record DeviceTypeAttributeCollection(List<CameraResolution> cameraResolutions, List<CameraSystem> cameraSystems, List<LensMount> lensMounts, List<TripodHead> tripodHeads, List<AudioConnector> audioConnectors) {
}

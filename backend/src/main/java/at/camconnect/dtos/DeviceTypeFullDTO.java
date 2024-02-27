package at.camconnect.dtos;

import at.camconnect.model.DeviceType;
import at.camconnect.model.Tag;

import java.util.List;

public record DeviceTypeFullDTO(DeviceType deviceType, int available, List<Tag> deviceTags) {
}

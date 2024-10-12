package at.camconnect.dtos.deviceSet;

import at.camconnect.enums.DeviceStatus;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.model.Tag;

import java.util.List;

public record DeviceSetCreateDTO (Long id, String name, String description, List<Long> deviceTypeIds, DeviceTypeStatusEnum status, List<Tag> tags) {
}

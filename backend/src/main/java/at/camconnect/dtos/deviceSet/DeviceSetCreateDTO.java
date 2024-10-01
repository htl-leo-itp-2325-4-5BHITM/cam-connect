package at.camconnect.dtos.deviceSet;

import at.camconnect.enums.DeviceStatus;

import java.util.List;

public record DeviceSetCreateDTO (Long id, String name, String description, List<Long> deviceTypeIds, DeviceStatus status) {
}

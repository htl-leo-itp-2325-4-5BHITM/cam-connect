package at.camconnect.dtos.deviceType;

import at.camconnect.enums.DeviceTypeVariantEnum;

public record DeviceTypeMinimalDTO(Long type_id, DeviceTypeVariantEnum variant, String name, String image) {
}

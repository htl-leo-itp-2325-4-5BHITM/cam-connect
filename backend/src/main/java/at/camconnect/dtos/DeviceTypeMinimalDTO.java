package at.camconnect.dtos;

import at.camconnect.enums.DeviceTypeVariantEnum;

public record DeviceTypeMinimalDTO(Long type_id, DeviceTypeVariantEnum variant, String name, String image) {
}

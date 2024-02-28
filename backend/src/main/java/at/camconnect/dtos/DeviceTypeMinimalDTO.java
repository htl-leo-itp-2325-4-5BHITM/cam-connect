package at.camconnect.dtos;

import at.camconnect.enums.DeviceTypeVariantEnum;

public record DeviceTypeMinimalDTO(Long type_id, String name, DeviceTypeVariantEnum variant, String image) {
}

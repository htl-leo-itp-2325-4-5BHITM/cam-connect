package at.camconnect.dtos.filters;

import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.enums.filters.OrderByFilterDevice;

import java.util.List;

public record DeviceFilters(OrderByFilterDevice orderBy, boolean onlyAvailable, List<DeviceTypeVariantEnum> deviceTypeVariant, List<Long> cameraResolutions, List<Long> cameraSensors, List<Long> cameraSystems, List<Long> lensMounts, List<Long> tripodHeads, List<Long> tags, String searchTerm) {
}

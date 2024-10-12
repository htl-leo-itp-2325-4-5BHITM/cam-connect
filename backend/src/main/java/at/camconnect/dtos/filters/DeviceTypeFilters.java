package at.camconnect.dtos.filters;

import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.enums.filters.OrderByFilterDevice;

import java.util.List;

public record DeviceTypeFilters(
        boolean onlyAvailable,
        List<DeviceTypeVariantEnum> variants,
        List<Long> attributes,
        List<Long> tags,
        String searchTerm
) { }

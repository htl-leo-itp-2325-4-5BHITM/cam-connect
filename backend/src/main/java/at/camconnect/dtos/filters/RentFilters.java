package at.camconnect.dtos.filters;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.filters.OrderByFilterRent;

import java.util.List;

public record RentFilters(OrderByFilterRent orderBy, List<RentStatusEnum> statuses, List<String> schoolClasses, List<Long> studentIds) {
}

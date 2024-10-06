package at.camconnect.dtos.filters;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.filters.OrderByFilterRent;

import java.util.List;

public record RentFilters(
        OrderByFilterRent orderBy,
        List<RentStatusEnum> statuses,
        List<String> schoolClasses,
        List<String> studentIds,
        String studentSearchTerm,
        String deviceTypeSearchTerm
) {
    public RentFilters {
        if(orderBy == null) {
            orderBy = OrderByFilterRent.ALPHABETICAL_ASC;
        }
        if(studentSearchTerm == null) {
            studentSearchTerm = "";
        }
        if(deviceTypeSearchTerm == null) {
            deviceTypeSearchTerm = "";
        }
        if(statuses == null) {
            statuses = List.of();
        }
        if(schoolClasses == null) {
            schoolClasses = List.of();
        }
        if(studentIds == null) {
            studentIds = List.of();
        }
    }
}

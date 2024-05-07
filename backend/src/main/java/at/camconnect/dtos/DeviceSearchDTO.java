package at.camconnect.dtos;

public record DeviceSearchDTO(String searchTerm, int typeId, boolean onlyAvailable) {
}

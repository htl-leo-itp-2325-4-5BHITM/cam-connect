package at.camconnect.dtos;

import at.camconnect.model.DeviceType;

public record DeviceDTO(String serial, String number, String note, int type_id) {
}

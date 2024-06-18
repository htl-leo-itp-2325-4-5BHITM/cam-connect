package at.camconnect.dtos;

import at.camconnect.enums.DeviceStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DeviceDTO(Long device_id, String serial, String number, String note, Long type_id, LocalDateTime creation_date, LocalDateTime change_date, DeviceStatus status) {
}

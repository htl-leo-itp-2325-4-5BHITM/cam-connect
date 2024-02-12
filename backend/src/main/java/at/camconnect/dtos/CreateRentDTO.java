package at.camconnect.dtos;

import java.time.LocalDate;

public record CreateRentDTO(long student_id, long device_id, long teacher_start_id, LocalDate rent_start, String note, String accessory, String device_string) {
}

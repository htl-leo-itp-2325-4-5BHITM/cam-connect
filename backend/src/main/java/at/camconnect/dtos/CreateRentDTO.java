package at.camconnect.dtos;

import java.time.LocalDate;

public record CreateRentDTO(long student_id, long device_type_id, String device_number, long teacher_start_id, LocalDate rent_start, LocalDate rent_end_planned, String note, String device_string) {
}

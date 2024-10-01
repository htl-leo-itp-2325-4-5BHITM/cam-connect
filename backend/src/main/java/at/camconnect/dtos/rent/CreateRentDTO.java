package at.camconnect.dtos.rent;

import at.camconnect.enums.RentTypeEnum;

import java.time.LocalDate;

public record CreateRentDTO(RentTypeEnum type, String student_id, Long device_id, String teacher_start_id, LocalDate rent_start, LocalDate rent_end_planned, String note, String device_string) {
}

package at.camconnect.dtos.rent;

import at.camconnect.enums.RentTypeEnum;

import java.time.LocalDate;

public record CreateRentDTO(RentTypeEnum type, Long student_id, Long device_id, Long teacher_start_id, LocalDate rent_start, LocalDate rent_end_planned, String note, String device_string) {
}

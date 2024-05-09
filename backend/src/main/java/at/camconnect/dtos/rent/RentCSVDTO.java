package at.camconnect.dtos.rent;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.RentTypeEnum;

import java.time.LocalDate;

public record RentCSVDTO(Long rent_id, RentStatusEnum status, RentTypeEnum type, Long device_id, String device_string, Long teacher_start_id, String teacher_start_name, Long teacher_end_id, String teacher_end_name, LocalDate rent_start, LocalDate rent_end_planned, LocalDate rent_end_actual, Long student_id, String student_name, String note, String verification_message) {
}

package at.camconnect.dtos.rent;

import at.camconnect.enums.RentStatusEnum;

import java.time.LocalDate;

public record RentIdsDTO(String student_id, int device_id, String teacher_id_start, String teacher_id_end, LocalDate rent_start, LocalDate rent_end_planned, LocalDate rent_end_actual, String verification_code, String verification_message, RentStatusEnum status, String note, String accessory, String device_string) {

}
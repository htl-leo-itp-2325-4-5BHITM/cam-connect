package at.camconnect.dtos;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.model.Device;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RentDTO(int student_id, int device_id, int teacher_id_start, int teacher_id_end, LocalDate rent_start, LocalDate rent_end_planned, LocalDate rent_end_actual, String verification_code, String verification_message, RentStatusEnum status, String note, String accessory, String device_string) {

}
package at.camconnect.dtos.rent;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.RentTypeEnum;
import at.camconnect.model.Device;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RentDTO(
    Long rent_id,
    RentStatusEnum status,
    RentTypeEnum type,
    Device device,
    String device_string,
    Teacher teacher_start,
    Teacher teacher_end,
    LocalDate rent_start,
    LocalDate rent_end_planned,
    LocalDate rent_end_actual,
    Student student,
    String note,
    String verification_message,
    LocalDateTime creation_date,
    LocalDateTime change_date
){ }

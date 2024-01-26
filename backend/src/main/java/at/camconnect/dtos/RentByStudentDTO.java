package at.camconnect.dtos;

import at.camconnect.model.Rent;
import at.camconnect.model.Student;

import java.util.List;

public record RentByStudentDTO(Student student, List<Rent> rentList) {

    public RentByStudentDTO {
    }

    public RentByStudentDTO(Student student) {
        this(student, null);
    }
}

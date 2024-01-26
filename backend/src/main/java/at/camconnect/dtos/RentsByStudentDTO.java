package at.camconnect.dtos;

import at.camconnect.model.Rent;
import at.camconnect.model.Student;

import java.util.List;

public record RentsByStudentDTO(Student student, List<Rent> rentList) {

    public RentsByStudentDTO {
    }

    public RentsByStudentDTO(Student student) {
        this(student, null);
    }
}

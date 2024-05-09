package at.camconnect.dtos.rent;

import at.camconnect.model.Student;

import java.util.List;

public record RentByStudentDTO(Student student, List<RentDTO> rentList) {

    public RentByStudentDTO {
    }

   /* public RentByStudentDTO(Student student) {
        this(student, null);
    }*/
}

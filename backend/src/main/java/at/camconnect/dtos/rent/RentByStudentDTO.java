package at.camconnect.dtos.rent;

import at.camconnect.model.User;

import java.util.List;

public record RentByStudentDTO(User student, List<RentDTO> rentList) {

    public RentByStudentDTO {
    }

   /* public RentByStudentDTO(Student student) {
        this(student, null);
    }*/
}

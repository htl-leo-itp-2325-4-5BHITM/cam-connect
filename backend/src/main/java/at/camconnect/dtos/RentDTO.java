package at.camconnect.dtos;

public class RentDTO {
    public record rentComplete(long rent_id, long student_id, long device_id, long teacher_id, String rent_start, String rent_end_planned, String rent_end_actual, String note){
    }
}

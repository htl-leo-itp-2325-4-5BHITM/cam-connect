package at.camconnect.model;

import at.camconnect.enums.RentStatusEnum;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;

@Entity
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rent_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "teacher_id_start")
    private Teacher teacher_start;

    @ManyToOne
    @JoinColumn(name = "teacher_id_end")
    private Teacher teacher_end;

    private LocalDate rent_start;
    private LocalDate rent_end_planned;
    private LocalDate rent_end_actual;
    private final LocalDateTime creation_date;
    private String verification_code;
    private String verification_message;
    private RentStatusEnum status;
    private String note;

    //TODO remove these when moving to new UI permanatly - also remove them in repo resource and update functions
    private String accessory;
    private String device_string;

    public Rent() {
        rent_start = LocalDate.now();
        creation_date = LocalDateTime.now();
        status = RentStatusEnum.CREATED;
    }

    public Rent(Student student) {
        this();
        this.student = student;
    }

    @Override
    public String toString() {
        return "Rent{" +
                "rent_id=" + rent_id +
                ", student=" + student +
                ", device=" + device +
                ", teacherStart=" + teacher_start +
                ", teacherEnd=" + teacher_end +
                ", rent_start=" + rent_start +
                ", rent_end_planned=" + rent_end_planned +
                ", rent_end_actual=" + rent_end_actual +
                ", creation_date=" + creation_date +
                ", status=" + status +
                ", code=" + verification_code +
                ", note='" + note + '\'' +
                '}';
    }

    public String generateVerification_code() {
        //this could possibly result in a problem with case sensitivity in urls
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            sb.append(randomChar);
        }

        // the verification code is set to current rent
        this.verification_code = sb.toString();

        return this.verification_code;
    }

    //region getter setter
    public String getAccessory() {
        return accessory;
    }

    public void setAccessory(String accessory) {
        this.accessory = accessory;
    }

    public Long getRent_id()  {
        return rent_id;
    }

    public void setRent_id(Long rent_id) {
        this.rent_id = rent_id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public Teacher getTeacher_start() {
        return teacher_start;
    }

    public void setTeacher_start(Teacher teacherStart) {
        this.teacher_start = teacherStart;
    }

    public Teacher getTeacher_end() {
        return teacher_end;
    }

    public void setTeacher_end(Teacher teacherEnd) {
        this.teacher_end = teacherEnd;
    }

    public LocalDate getRent_start() {
        return rent_start;
    }

    public void setRent_start(LocalDate rent_start) {
        this.rent_start = rent_start;
    }

    public LocalDate getRent_end_planned() {
        return rent_end_planned;
    }

    public void setRent_end_planned(LocalDate rent_end_planned) {
        this.rent_end_planned = rent_end_planned;
    }

    public LocalDate getRent_end_actual() {
        return rent_end_actual;
    }

    public void setRent_end_actual(LocalDate rent_end_actual) {
        this.rent_end_actual = rent_end_actual;
    }

    public RentStatusEnum getStatus() {
        return status;
    }

    public void setStatus(RentStatusEnum status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getVerification_code() {
        return verification_code;
    }

    public String getVerification_message() {
        return verification_message;
    }

    public void setVerification_message(String verification_message) {
        this.verification_message = verification_message;
    }

    public String getDevice_string() {
        return device_string;
    }

    public void setDevice_string(String deviceString) {
        this.device_string = deviceString;
    }

    public LocalDateTime getCreation_date() {
        return creation_date;
    }

    //endregion
}

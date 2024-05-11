package at.camconnect.model;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.RentTypeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;

@Entity
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long rent_id;
    @Enumerated(EnumType.STRING)
    private RentStatusEnum status;
    @Enumerated(EnumType.STRING)
    private RentTypeEnum type;

    //TODO i dont think we need the jsonignore and fetchtype lazy here
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id_start")
    private Teacher teacher_start;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id_end")
    private Teacher teacher_end;
    @Temporal(TemporalType.DATE)
    private LocalDate rent_start;
    @Temporal(TemporalType.DATE)
    private LocalDate rent_end_planned;
    @Temporal(TemporalType.DATE)
    private LocalDate rent_end_actual;
    private LocalDateTime creation_date;
    private LocalDateTime change_date;
    @Column(length = 20)
    private String verification_code;
    @Column(length = 150)
    private String verification_message;
    @Column(length = 150)
    private String note;
    @Column(length = 100)
    private String device_string;

    //TODO remove these when moving to new UI permanently - also remove them in repo resource and update functions
    private String accessory;


    public Rent(){
        this.status = RentStatusEnum.WAITING;
        this.creation_date = LocalDateTime.now();
        this.change_date = LocalDateTime.now();
    }

    /**
     * Rent with device as object
     */
    public Rent(Student student, Device device, Teacher teacher_start, LocalDate rent_start, LocalDate rent_end_planned, String note) {
        super();

        this.type = RentTypeEnum.DEFAULT;
        this.student = student;
        this.device = device;
        this.teacher_start = teacher_start;
        this.rent_start = rent_start;
        this.rent_end_planned = rent_end_planned;
        this.note = note;
    }

    /**
     * Rent with device as string
     */
    public Rent(Student student, String device_string, Teacher teacher_start, LocalDate rent_start, LocalDate rent_end_planned, String note) {
        super();

        this.type = RentTypeEnum.STRING;
        this.student = student;
        this.device_string = device_string;
        this.teacher_start = teacher_start;
        this.rent_start = rent_start;
        this.rent_end_planned = rent_end_planned;
        this.note = note;
    }

    public Rent(Long rent_id, RentStatusEnum status, RentTypeEnum type, Device device, String device_string, Teacher teacher_start, Teacher teacher_end, LocalDate rent_start, LocalDate rent_end_planned, LocalDate rent_end_actual, Student student, String note, String verification_message){
        super();

        this.status = status;
        this.type = type;
        this.device = device;
        this.device_string = device_string;
        this.teacher_start = teacher_start;
        this.teacher_end = teacher_end;
        this.rent_start = rent_start;
        this.rent_end_planned = rent_end_planned;
        this.rent_end_actual = rent_end_actual;
        this.student = student;
        this.note = note;
        this.verification_message = verification_message;
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

        this.updateChangeDate();

        return this.verification_code;
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

    public void updateChangeDate() {
        this.change_date = LocalDateTime.now();
    }

    //region getter setter
    public String getAccessory() {
        return accessory;
    }

    public void setAccessory(String accessory) {
        this.accessory = accessory;
        this.updateChangeDate();
    }

    public Long getRent_id()  {
        return rent_id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
        this.updateChangeDate();
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
        this.updateChangeDate();
    }

    public Teacher getTeacher_start() {
        return teacher_start;
    }

    public void setTeacher_start(Teacher teacherStart) {
        this.teacher_start = teacherStart;
        this.updateChangeDate();
    }

    public Teacher getTeacher_end() {
        return teacher_end;
    }

    public void setTeacher_end(Teacher teacherEnd) {
        this.teacher_end = teacherEnd;
        this.updateChangeDate();
    }

    public LocalDate getRent_start() {
        return rent_start;
    }

    public void setRent_start(LocalDate rent_start) {
        this.rent_start = rent_start;
        this.updateChangeDate();
    }

    public LocalDate getRent_end_planned() {
        return rent_end_planned;
    }

    public void setRent_end_planned(LocalDate rent_end_planned) {
        this.rent_end_planned = rent_end_planned;
        this.updateChangeDate();
    }

    public LocalDate getRent_end_actual() {
        return rent_end_actual;
    }

    public void setRent_end_actual(LocalDate rent_end_actual) {
        this.rent_end_actual = rent_end_actual;
        this.updateChangeDate();
    }

    public RentStatusEnum getStatus() {
        return status;
    }

    public void setStatus(RentStatusEnum status) {
        this.status = status;
        this.updateChangeDate();
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
        this.updateChangeDate();
    }

    public String getVerification_code() {
        return verification_code;
    }

    public String getVerification_message() {
        return verification_message;
    }

    public void setVerification_message(String verification_message) {
        this.verification_message = verification_message;
        this.updateChangeDate();
    }

    public String getDevice_string() {
        return device_string;
    }

    public void setDevice_string(String deviceString) {
        this.device_string = deviceString;
        this.updateChangeDate();
    }

    public RentTypeEnum getType() {
        return type;
    }

    public void setType(RentTypeEnum type) {
        this.type = type;
        this.updateChangeDate();
    }

    public LocalDateTime getCreation_date() {
        return creation_date;
    }

    public LocalDateTime getChange_date() {
        return change_date;
    }

    //endregion
}

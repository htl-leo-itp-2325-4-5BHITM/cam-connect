package at.camconnect.model;

import at.camconnect.Enums.RentStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rent_seq")
    @SequenceGenerator(name = "rent_seq", sequenceName = "RENT_SEQ", allocationSize = 1)
    private long rent_id;

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
    private RentStatus status;
    private String note;

    public Rent() {
        rent_start = LocalDate.now();
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
                ", status=" + status +
                ", note='" + note + '\'' +
                '}';
    }

    public long getRent_id() {
        return rent_id;
    }

    public void setRent_id(long rent_id) {
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

    public RentStatus getStatus() {
        return status;
    }

    public void setStatus(RentStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

package at.camconnect.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Rent {
    @Id
    @GeneratedValue
    private int rent_id;

    @ManyToOne
    @JoinColumn(name = "studentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "teacherId")
    private Teacher teacher;

    private Date rent_start;
    private Date rent_end_planned;
    private Date rent_end_actual;

    public Rent() {
    }

    public Rent(Date rentStart, Date rentEndPlanned, Date rentEndActual) {
        this.rent_start = rentStart;
        this.rent_end_planned = rentEndPlanned;
        this.rent_end_actual = rentEndActual;
    }

    public Rent(Student student, Device device, Teacher teacher, Date rentStart, Date rentEndPlanned, Date rentEndActual) {
        this.student = student;
        this.device = device;
        this.teacher = teacher;
        this.rent_start = rentStart;
        this.rent_end_planned = rentEndPlanned;
        this.rent_end_actual = rentEndActual;
    }

    public int getRent_id() {
        return rent_id;
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

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Date getRent_start() {
        return rent_start;
    }

    public void setRent_start(Date rentStart) {
        this.rent_start = rentStart;
    }

    public Date getRent_end_planned() {
        return rent_end_planned;
    }

    public void setRent_end_planned(Date rentEndPlanned) {
        this.rent_end_planned = rentEndPlanned;
    }

    public Date getRent_end_actual() {
        return rent_end_actual;
    }

    public void setRent_end_actual(Date rentEndActual) {
        this.rent_end_actual = rentEndActual;
    }
}

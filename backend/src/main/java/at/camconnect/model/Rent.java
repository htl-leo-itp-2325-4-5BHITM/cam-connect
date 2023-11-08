package at.camconnect.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Rent {
    @Id
    @GeneratedValue
    private int rentId;

    @ManyToOne
    @JoinColumn(name = "studentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "deviceId")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "teacherId")
    private Teacher teacher;

    private Date rentStart;
    private Date rentEndPlanned;
    private Date rentEndActual;

    public Rent() {
    }

    public Rent(Date rentStart, Date rentEndPlanned, Date rentEndActual) {
        this.rentStart = rentStart;
        this.rentEndPlanned = rentEndPlanned;
        this.rentEndActual = rentEndActual;
    }

    public Rent(Student student, Device device, Teacher teacher, Date rentStart, Date rentEndPlanned, Date rentEndActual) {
        this.student = student;
        this.device = device;
        this.teacher = teacher;
        this.rentStart = rentStart;
        this.rentEndPlanned = rentEndPlanned;
        this.rentEndActual = rentEndActual;
    }

    public int getRentId() {
        return rentId;
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

    public Date getRentStart() {
        return rentStart;
    }

    public void setRentStart(Date rentStart) {
        this.rentStart = rentStart;
    }

    public Date getRentEndPlanned() {
        return rentEndPlanned;
    }

    public void setRentEndPlanned(Date rentEndPlanned) {
        this.rentEndPlanned = rentEndPlanned;
    }

    public Date getRentEndActual() {
        return rentEndActual;
    }

    public void setRentEndActual(Date rentEndActual) {
        this.rentEndActual = rentEndActual;
    }
}

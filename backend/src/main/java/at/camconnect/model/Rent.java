package at.camconnect.model;

import at.camconnect.repository.StudentRepository;
import jakarta.ejb.Local;
import jakarta.persistence.*;
import org.apache.derby.client.am.DateTime;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Entity
public class Rent {
    @Id
    @GeneratedValue
    private long rent_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    private Date rent_start;
    private Date rent_end_planned;
    private Date rent_end_actual;

    public Rent() {
    }

    public Rent(Student student) {
        this.student = student;
        this.rent_start = new Timestamp(new Date().getTime());
    }

    public Rent(Student student, Device device, Teacher teacher, Date rentStart, Date rentEndPlanned, Date rentEndActual) {
        this.student = student;
        this.device = device;
        this.teacher = teacher;
        this.rent_start = rentStart;
        this.rent_end_planned = rentEndPlanned;
        this.rent_end_actual = rentEndActual;
    }

    @Override
    public String toString() {
        return "Rent{" +
                "rent_id=" + rent_id +
                ", student=" + student +
                ", device=" + device +
                ", teacher=" + teacher +
                ", rent_start=" + rent_start +
                ", rent_end_planned=" + rent_end_planned +
                ", rent_end_actual=" + rent_end_actual +
                '}';
    }

    public long getRent_id() {
        return rent_id;
    }
    public void setRent_id(int id) {
        rent_id = id;
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

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

    private String rent_start;
    private String rent_end_planned;
    private String rent_end_actual;

    public Rent() {
        this.rent_start = new Timestamp(new Date().getTime()).toString();
    }

    public Rent(Student student, String rentStart, String rentEndPlanned, String rentEndActual) {
        this();
        this.student = student;

        if(!rentStart.isEmpty()){
            this.rent_start = rentStart;
        }
        this.rent_end_planned = rentEndPlanned;
        this.rent_end_actual = rentEndActual;
    }

    public Rent(Student student, Device device, Teacher teacher, String rentStart, String rentEndPlanned, String rentEndActual) {
        this();

        this.student = student;
        this.device = device;
        this.teacher = teacher;

        if(!rentStart.isEmpty()){
            this.rent_start = rentStart;
        }
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

    public String getRent_start() {
        return rent_start;
    }

    public void setRent_start(String rent_start) {
        this.rent_start = rent_start;
    }

    public String getRent_end_planned() {
        return rent_end_planned;
    }

    public void setRent_end_planned(String rent_end_planned) {
        this.rent_end_planned = rent_end_planned;
    }

    public String getRent_end_actual() {
        return rent_end_actual;
    }

    public void setRent_end_actual(String rent_end_actual) {
        this.rent_end_actual = rent_end_actual;
    }
}

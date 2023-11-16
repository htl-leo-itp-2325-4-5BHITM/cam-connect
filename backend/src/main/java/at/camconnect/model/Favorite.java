package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Favorite {
    @Id
    @GeneratedValue
    private long fav_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    public Favorite(long fav_id, Student student, Device device) {
        this.fav_id = fav_id;
        this.student = student;
        this.device = device;
    }

    public Favorite() {
    }

    public long getFav_id() {
        return fav_id;
    }

    public void setFav_id(long fav_id) {
        this.fav_id = fav_id;
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
}

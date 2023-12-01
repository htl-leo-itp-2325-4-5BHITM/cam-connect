package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "device_teacher_seq")
    @SequenceGenerator(name = "device_teacher_seq", sequenceName = "DEVICE_TEACHER_SEQ", allocationSize = 1)
    private Long teacher_id;
    private String firstname;
    private String lastname;
    private String verification;
    private String password;
    private String username;

    public Teacher() {
    }

    public Teacher(String firstname, String lastname, String verification, String password, String username) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.verification = verification;
        this.password = password;
        this.username = username;
    }

    @Override
    public String toString() {
        return "Teacher{" +
                "teacher_id=" + teacher_id +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", verification='" + verification + '\'' +
                ", password='" + password + '\'' +
                ", user_id='" + username + '\'' +
                '}';
    }

    public long getTeacher_id() {
        return teacher_id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getVerification() {
        return verification;
    }

    public void setVerification(String verification) {
        this.verification = verification;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String userId) {
        this.username = userId;
    }
}

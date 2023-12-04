package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_seq")
    @SequenceGenerator(name = "student_seq", sequenceName = "STUDENT_SEQ", allocationSize = 1)
    private Long student_id;
    
    private String firstname;
    private String lastname;
    private String school_class;
    private String email;
    private String username;
    private String password;

    @OneToMany(fetch = FetchType.EAGER)
    private List<DeviceType> favourites;

    public Student() {
    }

    public Student(String firstname, String lastname, String school_class, String email, String password, String username) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.school_class = school_class;
        this.email = email;
        setPassword(password);
        this.username = username;
    }

    @Override
    public String toString() {
        return "Student{" +
                "student_id=" + student_id +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", school_class='" + school_class + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                '}';
    }

    public long getStudent_id() {
        return student_id;
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

    public String getSchool_class() {
        return school_class;
    }

    public void setSchool_class(String schoolclass) {
        this.school_class = schoolclass;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        //TODO encrypt the password
        this.password = password;
    }

    public String getUserId() {
        return username;
    }

    public void setUserId(String userId) {
        this.username = userId;
    }

    public List<DeviceType> getFavourites() {
        return favourites;
    }

    public void addFavourite(DeviceType favourite) {
        this.favourites.add(favourite);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

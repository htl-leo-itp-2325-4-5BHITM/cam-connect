package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Student {
    
    @Id
    @GeneratedValue
    private int student_id;
    
    private String firstname;
    private String lastname;
    private String school_class;
    private String password;
    private String user_id;

    public Student() {
    }

    public Student(String firstname, String lastname, String school_class, String password, String user_id) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.school_class = school_class;
        this.password = password;
        this.user_id = user_id;
    }

    public int getStudent_id() {
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
        return user_id;
    }

    public void setUserId(String userId) {
        this.user_id = userId;
    }
}

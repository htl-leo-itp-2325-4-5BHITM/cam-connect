package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Student {
    
    @Id
    @GeneratedValue
    private int student_id;
    
    private String name;
    private String school_class;
    private String password;
    private String user_id;

    public Student() {
    }

    public Student(String name, String schoolclass, String password, String userid) {
        this.name = name;
        this.school_class = schoolclass;
        setPassword(password);
        this.user_id = userid;
    }

    @Override
    public String toString() {
        return name;
    }

    public int getStudent_id() {
        return student_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

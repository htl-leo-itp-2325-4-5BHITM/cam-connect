package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class Student {
    
    @Id
    @GeneratedValue
    private int studentId;
    
    private String name;
    private String schoolClass;
    private String password;
    private String userId;

    public Student() {
    }

    public Student(String name, String schoolClass, String password, String userId) {
        this.name = name;
        this.schoolClass = schoolClass;
        setPassword(password);
        this.userId = userId;
    }

    public int getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(String schoolClass) {
        this.schoolClass = schoolClass;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        //TODO encrypt the password
        this.password = password;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

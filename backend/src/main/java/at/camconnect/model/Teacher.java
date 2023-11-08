package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Teacher {

    @Id
    @GeneratedValue
    private int teacherId;
    private String name;
    private String verification;
    private String password;
    private String userId;

    public Teacher() {
    }

    public Teacher(String name, String verification, String password, String userId) {
        this.name = name;
        this.verification = verification;
        this.password = password;
        this.userId = userId;
    }

    public int getTeacherId() {
        return teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

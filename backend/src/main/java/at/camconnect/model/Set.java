package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Set {

    @Id
    @GeneratedValue
    private long teacher_id;

    private String name;
    private String verification;
    private String password;
    private String user_Id;

    public Set(String name, String verification, String password, String userId) {
        this.name = name;
        this.verification = verification;
        this.password = password;
        this.user_Id = userId;
    }

    public Set() {
    }

    //<editor-fold desc="Getter and Setter">
    public long getTeacherID() {
        return teacher_id;
    }

    public void setTeacherID(long teacherID) {
        this.teacher_id = teacherID;
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
        return user_Id;
    }

    public void setUserId(String userId) {
        this.user_Id = userId;
    }
    //</editor-fold>
}

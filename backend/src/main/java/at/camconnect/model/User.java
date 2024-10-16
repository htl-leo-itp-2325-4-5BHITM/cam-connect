package at.camconnect.model;

import at.camconnect.enums.UserRoleEnum;
import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    private String user_id;
    private String firstname;
    private String lastname;
    private String email;
    private String username;
    private String school_class;

    public User(String user_id, String firstname, String lastname, String email, String username, String school_class) {
        this.user_id = user_id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.school_class = school_class;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public User() { }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String verification) {
        this.email = verification;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String userId) {
        this.username = userId;
    }

    public String getSchool_class() {
        return school_class;
    }

    public void setSchool_class(String school_class) {
        this.school_class = school_class;
    }
}

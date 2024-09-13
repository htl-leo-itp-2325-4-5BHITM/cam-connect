package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue
    private Long user_id;
    private String firstname;
    private String lastname;
    protected String email;
    private String username;
    private String password;

    private final LocalDate creationDate;
    private LocalDate lastPWCheck;

    public Long getUser_id() {
        return user_id;
    }

    public User(String firstname, String lastname, String email, String username, String password) {
        this();
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User() {
        this.creationDate = LocalDate.now();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String verification) {
        this.email = verification;
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

    public LocalDate getLastPWCheck() {
        return lastPWCheck;
    }

    public void setLastPWCheck(LocalDate lastPWCheck) {
        this.lastPWCheck = lastPWCheck;
    }
}

package at.camconnect.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "app_user")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    private String firstname;
    private String lastname;
    protected String email;
    private String username;
    private String password;

    private final LocalDate creation_date;
    private LocalDate last_pw_check;

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
        this.creation_date = LocalDate.now();
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

    public LocalDate getLast_pw_check() {
        return last_pw_check;
    }

    public void setLast_pw_check(LocalDate lastPWCheck) {
        this.last_pw_check = lastPWCheck;
    }
}

package at.camconnect.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

public class Teacher {

    @Id
    @GeneratedValue
    private int teacherId;
    private String firstname;
    private String lastname;

    public Teacher(String firstname, String lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
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
}

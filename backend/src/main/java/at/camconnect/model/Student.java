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
    
    private String firstname;
    private String lastname;
    private LocalDate birthday;

    public Student(String firstname, String lastname, String birthday) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.birthday = LocalDate.parse(birthday);
    }

    public Student() {
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

    public LocalDate getBirthday() {
        return birthday;
    }

    //TODO i dont know if this is really a good solution but if we give data via json we need to convert from text to object idk pls kill me
    public void setBirthday(String birthday) {
        this.birthday = LocalDate.parse(birthday);
    }
}

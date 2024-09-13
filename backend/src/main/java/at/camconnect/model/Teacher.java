package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Teacher extends User{
    public Teacher() {}

    public Teacher(String firstname, String lastname, String email, String password, String username) {
        super(firstname, lastname, email, password, username);
    }
}

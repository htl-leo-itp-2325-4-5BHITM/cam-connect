package at.camconnect.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Student extends User {
    private String school_class;

    @OneToMany()
    @JsonIgnore
    private List<DeviceType> favourites;

    public Student(String firstname, String lastname, String email, String username, String password, String school_class) {
        super(firstname, lastname, email, username, password);
        this.school_class = school_class;
    }

    public Student() {
    }

    @Override
    public String getEmail() {
        if(this.email != null)
            return this.email;
        else
            return this.getFirstname().toLowerCase().charAt(0) + "." + this.getLastname().toLowerCase() + "@students.htl-leonding.ac.at";
    }

    public List<DeviceType> getFavourites() {
        return favourites;
    }

    public void addFavourite(DeviceType favourite) {
        this.favourites.add(favourite);
    }

    public String getSchool_class() {
        return school_class;
    }

    public void setSchool_class(String school_class) {
        this.school_class = school_class;
    }
}

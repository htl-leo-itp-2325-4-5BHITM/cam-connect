package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Student extends User {
    private String school_class;

    @OneToMany(fetch = FetchType.EAGER)
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
}

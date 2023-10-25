package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Equipment {

    @Id
    private Long id;

    public String name;

    public Equipment(String name) {
        this.name = name;
    }

    public Equipment() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

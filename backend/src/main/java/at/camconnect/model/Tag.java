package at.camconnect.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long tag_id;

    @OneToMany
    private List<DeviceType> type;

    @Column(length = 20, unique = true)
    private String name;

    @Column(length = 150, unique = true)
    private String description;

    public Tag(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Tag() {
    }

    public long getTag_id() {
        return tag_id;
    }

    public void setTag_id(long tag_Id) {
        this.tag_id = tag_Id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

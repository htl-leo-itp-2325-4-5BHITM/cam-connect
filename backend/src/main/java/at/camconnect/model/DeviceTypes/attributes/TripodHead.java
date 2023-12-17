package at.camconnect.model.DeviceTypes.attributes;

import at.camconnect.model.DeviceTypes.TripodType;
import jakarta.persistence.*;

@Entity
public class TripodHead {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tripod_head_seq")
    @SequenceGenerator(name = "tripod_head_seq", sequenceName = "TRIPOD_HEAD_SEQ", allocationSize = 1)
    private long head_id;

    private String name;

    public TripodHead(long head_id, String name) {
        this.head_id = head_id;
        this.name = name;
    }

    public TripodHead() {
    }

    public long getHead_id() {
        return head_id;
    }

    public void setHead_id(long head_id) {
        this.head_id = head_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

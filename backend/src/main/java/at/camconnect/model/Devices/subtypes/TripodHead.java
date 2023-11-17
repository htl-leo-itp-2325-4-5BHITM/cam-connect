package at.camconnect.model.Devices.subtypes;

import at.camconnect.model.Devices.TripodType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class TripodHead {
    @Id
    private long head_id;

    private String name;

    @ManyToOne
    private TripodType tripodType;

    public TripodHead(long head_id, String name, TripodType tripodType) {
        this.head_id = head_id;
        this.name = name;
        this.tripodType = tripodType;
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

    public TripodType getTripodType() {
        return tripodType;
    }

    public void setTripodType(TripodType tripodType) {
        this.tripodType = tripodType;
    }
}

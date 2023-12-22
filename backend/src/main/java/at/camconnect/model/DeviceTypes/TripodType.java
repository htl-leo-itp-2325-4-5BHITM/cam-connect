package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.TripodHead;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TripodType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "head_id")
    private TripodHead head;
    private double height;

    public TripodType() {
    }

    public TripodType(String typeName, double height, TripodHead head) {
        super(typeName);
        this.height = height;
        this.head = head;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public TripodHead getHead() {
        return head;
    }

    public void setHead(TripodHead head) {
        this.head = head;
    }
}

package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class TripodType extends DeviceType {
    private double height;
    private String head;

    public TripodType() {
    }

    public TripodType(String typeName, double height, String head) {
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

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }
}

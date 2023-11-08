package at.camconnect.model.Devices;

import at.camconnect.model.Device;
import jakarta.persistence.Entity;

@Entity
public class TripodType extends Device {
    private double height;
    private String head;

    public TripodType() {
    }

    public TripodType(String serial, String note, double height, String head) {
        super(serial, note);
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

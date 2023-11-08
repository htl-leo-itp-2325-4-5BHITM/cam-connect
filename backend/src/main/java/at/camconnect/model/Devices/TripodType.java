package at.camconnect.model.Devices;

import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class TripodType extends DeviceType {
    private double height;
    private String head;

    public TripodType() {
    }

    public TripodType(String typeName, long typeId, double height, String head) {
        super(typeName, typeId);
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

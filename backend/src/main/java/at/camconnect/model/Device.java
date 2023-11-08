package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Device {
    @Id
    @GeneratedValue
    private int deviceId;
    private String serial;
    private String note;

    public Device() {
    }

    public Device(String serial, String note) {
        this.serial = serial;
        this.note = note;
    }

    public int getDeviceId() {
        return deviceId;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

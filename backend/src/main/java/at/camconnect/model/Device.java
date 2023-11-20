package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Device {
    @Id
    @GeneratedValue
    private Long device_id;
    private String serial;
    private String note;

    @ManyToOne
    private DeviceType type;

    public Device() {
    }

    public Device(String serial, String note) {
        this.serial = serial;
        this.note = note;
    }

    @Override
    public String toString() {
        return "Device{" +
                "device_id=" + device_id +
                ", serial='" + serial + '\'' +
                ", note='" + note + '\'' +
                '}';
    }

    public long getDevice_id() {
        return device_id;
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

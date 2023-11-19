package at.camconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Device {
    @Id
    @GeneratedValue
    private long device_id;
    private String serial;
    private String note;

    @ManyToOne
    private DeviceType deviceType;

    public Device() {
    }

    public Device(String serial, String note, DeviceType deviceType) {
        this.serial = serial;
        this.note = note;
        this.deviceType = deviceType;
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

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }
}

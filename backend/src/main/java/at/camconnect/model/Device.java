package at.camconnect.model;

import jakarta.persistence.*;

@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long device_id;
    @Column(length = 5)
    private String serial;
    @Column(length = 15)
    private String number;
    @Column(length = 150)
    private String note;
    @ManyToOne
    @JoinColumn(name = "type_id")
    private DeviceType type;

    public Device() {
    }

    public Device(String serial, String number, String note, DeviceType type) {
        this.serial = serial;
        this.number = number;
        this.note = note;
        this.type = type;
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

    public DeviceType getType() {
        return type;
    }

    public void setType(DeviceType type) {
        this.type = type;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}

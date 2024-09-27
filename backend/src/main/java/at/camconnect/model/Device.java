package at.camconnect.model;

import at.camconnect.enums.DeviceStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 4)
    private Long device_id;
    @Column(length = 30, unique = true)
    private String serial;
    @Column(length = 15)
    private String number;
    @Column(length = 150)
    private String note;
    @ManyToOne
    @JoinColumn(name = "type_id")
    private DeviceType type;
    private LocalDateTime creation_date;
    private LocalDateTime change_date;

    @Enumerated(EnumType.STRING)
    private DeviceStatus status;

    public Device() {
        this.creation_date = LocalDateTime.now();
    }

    public Device(String serial, String number, String note, DeviceType type, DeviceStatus status) {
        this.serial = serial;
        this.number = number;
        this.note = note;
        this.type = type;
        this.creation_date = LocalDateTime.now();
        this.status = status;
    }

    @Override
    public String toString() {
        return "Device{" +
                "device_id=" + device_id +
                ", serial='" + serial + '\'' +
                ", note='" + note + '\'' +
                '}';
    }

    public void setChange_date(LocalDateTime change_date) {
        this.change_date = change_date;
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

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreation_date() {
        return creation_date;
    }

    public LocalDateTime getChange_date() {
        return change_date;
    }
}

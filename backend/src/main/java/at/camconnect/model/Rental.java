package at.camconnect.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.Date;

public class Rental {
    @Id
    @GeneratedValue
    private int rentalId;
    private Date rentStart;
    private Date rentEnd;
    private Device deviceId;

    public Rental(int rentalId, Date rentStart, Date rentEnd, Device deviceId) {
        this.rentalId = rentalId;
        this.rentStart = rentStart;
        this.rentEnd = rentEnd;
        this.deviceId = deviceId;
    }

    public int getRentalId() {
        return rentalId;
    }

    public void setRentalId(int rentalId) {
        this.rentalId = rentalId;
    }

    public Date getRentStart() {
        return rentStart;
    }

    public void setRentStart(Date rentStart) {
        this.rentStart = rentStart;
    }

    public Date getRentEnd() {
        return rentEnd;
    }

    public void setRentEnd(Date rentEnd) {
        this.rentEnd = rentEnd;
    }

    public Device getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Device deviceId) {
        this.deviceId = deviceId;
    }
}

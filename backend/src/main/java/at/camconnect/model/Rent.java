package at.camconnect.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.Date;

public class Rent {
    @Id
    @GeneratedValue
    private int rentId;
    private Date rentStart;
    private Date rentEndActual;
    private Date rentEndPlanned;

    private Device deviceId;

    public Rent(int rentId, Date rentStart, Date rentEndPlanned, Date rentEndActual, Device deviceId) {
        this.rentId = rentId;
        this.rentStart = rentStart;
        this.rentEndPlanned = rentEndPlanned;
        this.rentEndActual = rentEndActual;
        this.deviceId = deviceId;
    }

    public int getRentId() {
        return rentId;
    }

    public void setRentId(int rentId) {
        this.rentId = rentId;
    }

    public Date getRentStart() {
        return rentStart;
    }

    public void setRentStart(Date rentStart) {
        this.rentStart = rentStart;
    }

    public Date getRentEndPlanned() {
        return rentEndPlanned;
    }

    public void setRentEndPlanned(Date rentEndPlanned) {
        this.rentEndPlanned = rentEndPlanned;
    }

    public Device getDeviceId() {
        return deviceId;
    }

    public Date getRentEndActual() {
        return rentEndActual;
    }

    public void setRentEndActual(Date rentEndActual) {
        this.rentEndActual = rentEndActual;
    }
}

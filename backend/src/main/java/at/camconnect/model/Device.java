package at.camconnect.model;

public class Device {
    private int deviceId;
    private int typId;

    public Device(int deviceId, int typId) {
        this.deviceId = deviceId;
        this.typId = typId;
    }

    public int getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public int getTypId() {
        return typId;
    }

    public void setTypId(int typId) {
        this.typId = typId;
    }
}

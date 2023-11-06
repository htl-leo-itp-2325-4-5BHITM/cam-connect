package at.camconnect.model.Devices;

import at.camconnect.model.Device;

public class Camera extends Device {
    private String sensor;
    private String mount;
    private String resolution;

    public Camera(int deviceId, int typId) {
        super(deviceId, typId);
    }
}

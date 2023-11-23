package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class AudioType extends DeviceType {
    private boolean windblocker;
    private boolean wireless;
    private boolean needsRecorder;

    public AudioType(String typeName, boolean windblocker, boolean wireless, boolean needsRecorder) {
        super(typeName);
        this.windblocker = windblocker;
        this.wireless = wireless;
        this.needsRecorder = needsRecorder;
    }

    public AudioType() {
    }

    public boolean isWindblocker() {
        return windblocker;
    }

    public void setWindblocker(boolean windblocker) {
        this.windblocker = windblocker;
    }

    public boolean isWireless() {
        return wireless;
    }

    public void setWireless(boolean wireless) {
        this.wireless = wireless;
    }

    public boolean isNeedsRecorder() {
        return needsRecorder;
    }

    public void setNeedsRecorder(boolean needsRecorder) {
        this.needsRecorder = needsRecorder;
    }
}

package at.camconnect.model.DeviceTypes;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.DeviceType;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

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

    @Transactional
    @Override
    public void update(JsonObject data) {
        try{
            setWindblocker(data.getBoolean("windblocker"));
        } catch (Exception e) {
            throw new CCException(1006, "windlocker was not updated");
        }

        try{
            data.getBoolean("wireless");
        } catch (Exception e) {
            throw new CCException(1006, "wireless was not updated");
        }

        try{
            data.getBoolean("needsRecorder");
        } catch (Exception e) {
            throw new CCException(1006, "needsRecorder was not updated");
        }
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

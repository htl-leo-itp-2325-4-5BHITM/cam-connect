package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobalObjectsDTO;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;

@Entity
public class MicrophoneType extends DeviceType {
    private boolean windblocker;
    private boolean wireless;
    private boolean needs_recorder;

    public MicrophoneType(String typeName, boolean windblocker, boolean wireless, boolean needs_recorder) {
        super(typeName);
        this.windblocker = windblocker;
        this.wireless = wireless;
        this.needs_recorder = needs_recorder;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setWindblocker(data.windblocker());
            setWireless(data.wireless());
            setNeeds_recorder(data.needsrecorder());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public MicrophoneType() {

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

    public boolean isNeeds_recorder() {
        return needs_recorder;
    }

    public void setNeeds_recorder(boolean needsRecorder) {
        this.needs_recorder = needsRecorder;
    }
}

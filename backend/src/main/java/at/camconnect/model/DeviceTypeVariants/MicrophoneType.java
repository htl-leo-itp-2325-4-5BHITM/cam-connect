package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class MicrophoneType extends DeviceType {
    private boolean windblocker;
    private boolean wireless;
    private boolean needs_recorder;

    public MicrophoneType() {
        super();
        setVariant(DeviceTypeVariantEnum.microphone);
    }

    public MicrophoneType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, boolean windblocker, boolean wireless, boolean needs_recorder) {
        super(type_id, creation_date, name, image, status, variant);
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

    @Override
    public String toString() {
        return String.format("%d;%s;%s;%s;%s;%s;%b;%b;%b;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                isWindblocker(), isWireless(), isNeeds_recorder());
    }

    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s; ; ; ; ; ; ; ; ; ; ; ; ;%b;%b;%b; ; ; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                isWindblocker(),
                isWireless(),
                isNeeds_recorder()
        );
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

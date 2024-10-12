package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.AudioConnector;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.List;

@Entity
public class MicrophoneType extends DeviceType {
    private boolean needs_recorder;
    @ManyToOne
    @JoinColumn(name = "connector_id")
    private AudioConnector connector;
    private boolean needs_power;

    public MicrophoneType() {
        super();
        setVariant(DeviceTypeVariantEnum.microphone);
    }

    public MicrophoneType(String name, String image, boolean needs_recorder) {
        super(name, image, DeviceTypeVariantEnum.microphone);
        this.needs_recorder = needs_recorder;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setName(data.name());
            setImage_blob(data.image());
            setNeeds_recorder(data.needs_recorder());
            setConnector(data.connector());
            setNeeds_power(data.needs_power());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return "todo";
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return null;
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of(this.connector);
    }

    public boolean isNeeds_recorder() {
        return needs_recorder;
    }

    public void setNeeds_recorder(boolean needsRecorder) {
        this.needs_recorder = needsRecorder;
    }

    public boolean isNeeds_power() {
        return needs_power;
    }

    public void setNeeds_power(boolean needs_power) {
        this.needs_power = needs_power;
    }

    public AudioConnector getConnector() {
        return connector;
    }

    public void setConnector(AudioConnector connector) {
        this.connector = connector;
    }
}

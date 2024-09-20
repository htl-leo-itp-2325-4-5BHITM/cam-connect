package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.AudioConnector;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AudioType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "connector_id")
    private AudioConnector connector;

    public AudioType(String name, String image_blob_url, AudioConnector connector) {
        super(name, image_blob_url, DeviceTypeVariantEnum.audio);
        this.connector = connector;
    }

    public AudioType() {
        super();
        setVariant(DeviceTypeVariantEnum.audio);
    }

    public AudioConnector getConnector() {
        return connector;
    }

    public void setConnector(AudioConnector connector) {
        this.connector = connector;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        setName(data.name());
        setImage_blob(data.image());
        setConnector(data.connector());
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return null;
    }
}

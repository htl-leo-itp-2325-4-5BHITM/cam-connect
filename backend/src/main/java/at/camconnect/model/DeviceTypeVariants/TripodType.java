package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.model.DeviceTypeAttributes.TripodHead;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.List;

@Entity
public class TripodType extends DeviceType {
    @ManyToOne
    @JoinColumn(name = "head_id")
    private TripodHead head;
    @Column(length = 3)
    private int height_centimeters;

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setHead(data.head());
            setHeight_centimeters(data.height_centimeters());
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
        return new DeviceTypeGlobalIdDTO(getType_id(), getName(), getImage_blob(), getHeight_centimeters(), getHead().getAttribute_id());
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of(head);
    }

    public TripodType() {
        super();
        setVariant(DeviceTypeVariantEnum.tripod);
    }

    public TripodType(String name, String image, int height_centimeters, TripodHead head) {
        super(name, image, DeviceTypeVariantEnum.tripod);
        this.height_centimeters = height_centimeters;
        this.head = head;
    }

    public int getHeight_centimeters() {
        return height_centimeters;
    }

    public void setHeight_centimeters(int height) {
        this.height_centimeters = height;
    }

    public TripodHead getHead() {
        return head;
    }

    public void setHead(TripodHead head) {
        this.head = head;
    }
}

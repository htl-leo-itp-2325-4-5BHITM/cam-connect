package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttributes.TripodHead;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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

    public TripodType() {
        setVariant(DeviceTypeVariantEnum.tripod);
    }

    public TripodType(String typeName, int height_centimeters, TripodHead head) {
        super(typeName);
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

package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class StabilizerType extends DeviceType {
    @Column(length = 6)
    private double max_weight_kilograms; // in kg
    @Column(length = 1)
    private int number_of_axis;

    public StabilizerType() {
        super();
        setVariant(DeviceTypeVariantEnum.stabilizer);
    }

    public StabilizerType(Long type_id, LocalDateTime creation_date, String name, String image, DeviceTypeStatusEnum status, DeviceTypeVariantEnum variant, double max_weight_kilograms, int number_of_axis) {
        super(type_id, creation_date, name, image, status, variant);
        this.max_weight_kilograms = max_weight_kilograms;
        this.number_of_axis = number_of_axis;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setMax_weight_kilograms(data.max_weight_kilograms());
            setNumber_of_axis(data.number_of_axis());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    @Override
    public String toString() {
        return String.format("%d;%s;%s;%s;%s;%s;%f;%d;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getMax_weight_kilograms(), getNumber_of_axis());
    }

    @Override
    public String getFullExportString() {
        return String.format("%d;%s;%s;%s;%s;%s; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;%f;%d; ; ; ;\n",
                getType_id(), getCreation_date(), getName(), getImage(), getStatus(), getVariant(),
                getMax_weight_kilograms(),
                getNumber_of_axis()
        );
    }

    public double getMax_weight_kilograms() {
        return max_weight_kilograms;
    }

    public void setMax_weight_kilograms(double maxWeight) {
        this.max_weight_kilograms = maxWeight;
    }

    public int getNumber_of_axis() {
        return number_of_axis;
    }

    public void setNumber_of_axis(int numberOfAxis) {
        this.number_of_axis = numberOfAxis;
    }
}

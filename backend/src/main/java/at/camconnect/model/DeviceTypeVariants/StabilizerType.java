package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalObjectsDTO;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.util.List;

@Entity
public class StabilizerType extends DeviceType {
    @Column(length = 6)
    private double max_weight_kilograms;
    @Column(length = 1)
    private int number_of_axis;

    public StabilizerType() {
        super();
        setVariant(DeviceTypeVariantEnum.stabilizer);
    }

    public StabilizerType(String name, String image_blob_url, double max_weight_kilograms, int number_of_axis) {
        super(name, image_blob_url, DeviceTypeVariantEnum.stabilizer);
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
        return "needs to be updated";
    }

    @Override
    public DeviceTypeGlobalIdDTO toGlobalDTO() {
        return null;
    }

    @Override
    public List<DeviceTypeAttribute> getAttributes() {
        return List.of();
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

    @Override
    public String toCsvString() {
        return getVariant() + ";" + getType_id() + ";" + getName() + ";" + getImage_blob() + ";" + getStatus() + ";" + getTagsToString() + ";" + getMax_weight_kilograms() + ";" + getNumber_of_axis() + ";\n";
    }

    @Override
    public String getCsvHeader() {
        return "variant; type_id; name; image; status; tags; max_weight_kilograms; number_of_axis;\n";
    }

    @Override
    public void fromCsvString(String[] csvString, List<String> header) {
        super.fromCsvString(csvString, header);
        setType_id(Long.parseLong(csvString[header.indexOf("type_id")]));
        setMax_weight_kilograms(Double.parseDouble(csvString[header.indexOf("max_weight_kilograms")]));
        setNumber_of_axis(Integer.parseInt(csvString[header.indexOf("number_of_axis")]));
    }
}

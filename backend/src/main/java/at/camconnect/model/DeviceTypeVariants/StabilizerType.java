package at.camconnect.model.DeviceTypeVariants;

import at.camconnect.dtos.DeviceTypeGlobalObjectsDTO;
import at.camconnect.model.DeviceType;
import at.camconnect.responseSystem.CCException;
import jakarta.persistence.Entity;

@Entity
public class StabilizerType extends DeviceType {
    private int max_weight;
    private int number_of_axis;

    public StabilizerType(String typeName, int max_weight, int number_of_axis) {
        super(typeName);
        this.max_weight = max_weight;
        this.number_of_axis = number_of_axis;
    }

    @Override
    public void update(DeviceTypeGlobalObjectsDTO data) {
        try{
            setMax_weight(data.max_weight());
            setNumber_of_axis(data.number_of_axis());
        }catch (Exception ex){
            throw new CCException(1106);
        }
    }

    public StabilizerType() {
    }
    public int getMax_weight() {
        return max_weight;
    }

    public void setMax_weight(int maxWeight) {
        this.max_weight = maxWeight;
    }

    public int getNumber_of_axis() {
        return number_of_axis;
    }

    public void setNumber_of_axis(int numberOfAxis) {
        this.number_of_axis = numberOfAxis;
    }
}

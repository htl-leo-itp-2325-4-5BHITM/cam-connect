package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
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

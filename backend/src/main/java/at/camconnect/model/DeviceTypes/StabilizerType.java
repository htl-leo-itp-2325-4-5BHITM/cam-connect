package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import jakarta.persistence.Entity;

@Entity
public class StabilizerType extends DeviceType {
    private int maxWeight;
    private int numberOfAxis;

    public StabilizerType(String typeName, int maxWeight, int numberOfAxis) {
        super(typeName);
        this.maxWeight = maxWeight;
        this.numberOfAxis = numberOfAxis;
    }

    public StabilizerType() {
    }

    public int getMaxWeight() {
        return maxWeight;
    }

    public void setMaxWeight(int maxWeight) {
        this.maxWeight = maxWeight;
    }

    public int getNumberOfAxis() {
        return numberOfAxis;
    }

    public void setNumberOfAxis(int numberOfAxis) {
        this.numberOfAxis = numberOfAxis;
    }
}

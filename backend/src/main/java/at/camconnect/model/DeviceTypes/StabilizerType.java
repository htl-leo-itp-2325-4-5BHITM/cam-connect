package at.camconnect.model.DeviceTypes;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.DeviceType;
import jakarta.json.JsonObject;
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

    @Override
    public void update(JsonObject data) {
        try{
            setMax_weight(data.getInt("max_weight"));
        } catch (Exception e) {
            throw new CCException(1006, "max_weight was not updated");
        }
        try{
            setNumber_of_axis(data.getInt("number_of_axis"));
        } catch (Exception e) {
            throw new CCException(1006, "number_of_axis was not updated");
        }
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

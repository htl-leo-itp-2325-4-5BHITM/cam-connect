package at.camconnect.model.DeviceTypes;

import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypes.attributes.TripodHead;
import at.camconnect.errorSystem.CCException;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TripodType extends DeviceType {
    private double height;

    @ManyToOne
    @JoinColumn(name = "head_id")
    private TripodHead head;

    public TripodType() {
    }

    public TripodType(String typeName, double height, TripodHead head) {
        super(typeName);
        this.height = height;
        this.head = head;
    }

    @Override
    public void update(JsonObject data) {
        //TODO only getint possible here
        try{
            setHeight(data.getInt("height"));
        } catch (Exception e) {
            throw new CCException(1006, "height was not updated");
        }

        //TODO add head update
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public TripodHead getHead() {
        return head;
    }

    public void setHead(TripodHead head) {
        this.head = head;
    }
}

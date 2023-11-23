package at.camconnect.repository;

import at.camconnect.model.DeviceType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.JsonObject;

@ApplicationScoped
public class DeviceTypeRepository {
    public void createDevicetype(String type, JsonObject data){
        DeviceType deviceType;
        switch (type){
            case "Audio":
                
                break;
            case "Camera":
                break;
            case "Drone":
                break;
            case "Lens":
                break;
            case "Light":
                break;
            case "Stabilizer":
                break;
            case "Tripod":
                break;
        }
    }
}

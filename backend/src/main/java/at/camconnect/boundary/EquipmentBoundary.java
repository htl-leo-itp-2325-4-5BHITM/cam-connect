package at.camconnect.boundary;

import at.camconnect.model.Equipment;
import at.camconnect.repository.EquipmentRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/equipment")
public class EquipmentBoundary {

    public String equipmentDefault(){
        return "Hey vom equip";
    }
    @Inject
    EquipmentRepository equipmentRepository;

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Equipment getById(@PathParam("id")long id) {
        return equipmentRepository.getById(id);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/getname")
    public String getName(@PathParam("id")long id) {
        return equipmentRepository.getById(id).getName();
    }

    @Transactional
    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public String createEquipment(Equipment equipment){
        equipmentRepository.add(equipment);
        return "hallo";
    }
}

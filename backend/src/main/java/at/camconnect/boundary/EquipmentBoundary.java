package at.camconnect.boundary;

import at.camconnect.model.Equipment;
import at.camconnect.repository.EquipmentRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/equipment")
public class EquipmentBoundary {
    @Inject
    EquipmentRepository equipmentRepository;

    @GET
    @Path("get/{id: [0-9]+}/getname")
    public void setGrave(@PathParam("id")int id) {
        equipmentRepository.getById(id).getName();
    }

    @Transactional
    @POST
    @Path("create")
    @Consumes(MediaType.APPLICATION_JSON)
    public void createCoffin(Equipment equipment){
        equipmentRepository.add(equipment);
    }
}

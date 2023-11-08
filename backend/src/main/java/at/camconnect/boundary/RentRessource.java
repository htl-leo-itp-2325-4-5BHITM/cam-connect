package at.camconnect.boundary;

import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.repository.RentRepository;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/rent")
public class RentRessource {
    @Inject
    RentRepository rentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createRent (JsonObject rent){
        rentRepository.create(rent);
        return Response.ok().build();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateRent (JsonObject rent){
        rentRepository.update(rent);
        return Response.ok().build();
    }

    @GET
    @Path("/getall")
    public List<Rent> getAll() {
        return rentRepository.getAll();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Rent getById(@PathParam("id")long id) {
        return rentRepository.getById(id);
    }
}

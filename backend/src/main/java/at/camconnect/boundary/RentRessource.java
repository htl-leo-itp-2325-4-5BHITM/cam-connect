package at.camconnect.boundary;

import at.camconnect.model.Rent;
import at.camconnect.repository.RentRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/rent")
public class RentRessource {
    @Inject
    RentRepository rentRepository;

    @GET
    @Path("/getall")
    public List<Rent> getAll() {
        return rentRepository.getAll();
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addRent(Rent rent){
        rentRepository.addRent(rent);
        return Response.ok().build();
    }
}

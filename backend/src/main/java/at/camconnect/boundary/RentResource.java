package at.camconnect.boundary;

import at.camconnect.dtos.DeviceTypeCollection;
import at.camconnect.dtos.RentDTO;
import at.camconnect.dtos.RentsByStudentDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Rent;
import at.camconnect.repository.RentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import java.io.IOException;
import java.util.Map;
import jakarta.enterprise.context.ApplicationScoped;
import net.bytebuddy.asm.Advice;

@Path("/rent")
public class RentResource {
    @Inject
    RentRepository rentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createRent(RentDTO rent) {
        rentRepository.create(rent);
        return Response.ok().build();
    }

    @POST
    @Path("/createempty")
    @Transactional
    public Response createRentEmpty() {
        rentRepository.createEmpty();
        return Response.ok().build();
    }

    @GET
    @Path("/getall")
    @Transactional
    public Response getAll(){
        List<RentsByStudentDTO> result;
        try{
            result = rentRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id") Long id) {
        try {
            rentRepository.getById(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/sendconfirmation")
    public Response sendConfirmation(@PathParam("id") Long id) {
        try {
            rentRepository.sendConfirmation(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/confirm")
    public Response confirm(@PathParam("id") Long id, RentDTO rentDTO) {
        try {
            rentRepository.confirm(id, rentDTO);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/return")
    public Response returnRent(@PathParam("id") Long id, RentDTO rentDTO) {
        try {
            rentRepository.returnRent(id, rentDTO);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    public Response remove(@PathParam("id") Long id) {
        return rentRepository.remove(id);
    }

    @POST
    @Transactional
    @Path("/getbyid/{id: [0-9]+}/update/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, JsonObject rent) {
        try {
            rentRepository.update(id, rent);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Transactional
    @Path("/getbyid/{id: [0-9]+}/update/{attribute}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, RentDTO rent, @PathParam("attribute") String attribute) {
        try {
            rentRepository.updateAttribute(attribute, id, rent);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

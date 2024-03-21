package at.camconnect.boundary;

import at.camconnect.dtos.CreateRentDTO;
import at.camconnect.dtos.RentDTO;
import at.camconnect.dtos.RentByStudentDTO;
import at.camconnect.model.Rent;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.repository.RentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/rent")
@Produces(MediaType.APPLICATION_JSON)
public class RentResource {
    @Inject
    RentRepository rentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRent(List<CreateRentDTO> rent) {
        try{
            rentRepository.create(rent);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/createempty")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRentEmpty() {
        try{
            rentRepository.createEmpty();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getallsinglelist")
    public Response getAllSingleList(){
        List<Rent> result;
        try{
            result = rentRepository.getAllSingleList();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    public Response getAll(){
        List<RentByStudentDTO> result;
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
        Rent rent;
        try {
            rent = rentRepository.getById(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(rent);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/sendconfirmation")
    public Response sendConfirmation(@PathParam("id") Long id) {
        try {
            rentRepository.requestConfirmationMail(id);
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
        try{
            rentRepository.remove(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
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
    @Path("/getbyid/{id: [0-9]+}/update/{property}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, RentDTO rent, @PathParam("property") String property) {
        try {
            rentRepository.updateProperty(property, id, rent);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

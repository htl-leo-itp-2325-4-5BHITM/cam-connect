package at.camconnect.boundary;

import at.camconnect.dtos.filters.RentFilters;
import at.camconnect.dtos.rent.*;
import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.RentTypeEnum;
import at.camconnect.model.Rent;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.repository.RentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.jboss.resteasy.reactive.RestForm;

import java.io.*;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

@Path("/rent")
@Produces(MediaType.APPLICATION_JSON)
public class RentResource {
    @Inject
    RentRepository rentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRent(List<CreateRentDTO> rents) {
        try{
            rentRepository.create(rents);
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
        List<RentDTO> result;
        try{
            result = rentRepository.getAllSingleList();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/getall")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAll(RentFilters filters){
        List<RentByStudentDTO> result;
        try{
            result = rentRepository.getAllDashboard(filters);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id") Long id) {
        RentDTO rent;
        try {
            rent = rentRepository.getByIdCensored(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(rent);
    }

    @GET
    @Path("/getbyidlist/{ids}")
    public Response getByIdList(@PathParam("ids") String ids) {
        List<RentDTO> rents;
        try {
            String[] idList = ids.split(",");
            rents = rentRepository.getByIdList(idList);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(rents);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/sendconfirmation")
    public Response sendConfirmation(@PathParam("id") Long id) {
        try {
            List<Rent> rentList = new LinkedList<>();
            rentList.add(rentRepository.getById(id));
            rentRepository.sendConfirmationEmail(rentList);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/verifyconfirmationcode/{code}")
    public Response verifyConfirmationCode(@PathParam("id") Long id, @PathParam("code") String code) {
        boolean result;
        try {
            result = rentRepository.verifyConfirmationCode(id, code);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(result);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/updatestatus")
    public Response confirm(@PathParam("id") Long id, RentIdsDTO rentIdsDTO) {
        try {
            rentRepository.updateStatus(id, rentIdsDTO);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @PUT
    @Path("/getbyid/{id: [0-9]+}/return")
    public Response returnRent(@PathParam("id") Long id) {
        try {
            rentRepository.returnRent(id);
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
    public Response update(@PathParam("id") Long id, @PathParam("property") String property, JsonObject rent) {
        try {
            rentRepository.updateProperty(property, id, rent);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/getcsv")
    public Response exportAllRents() {
        try {
            return rentRepository.exportAllRents();
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/import")
    public Response importCSV(@RestForm File file){
        try{
            rentRepository.importRents(file);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

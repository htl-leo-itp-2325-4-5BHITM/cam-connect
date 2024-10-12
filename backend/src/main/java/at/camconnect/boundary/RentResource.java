package at.camconnect.boundary;

import at.camconnect.dtos.filters.RentFilters;
import at.camconnect.dtos.rent.*;
import at.camconnect.enums.RentStatusEnum;
import at.camconnect.model.Rent;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.repository.RentRepository;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.common.annotation.Blocking;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.resteasy.reactive.RestForm;

import java.io.*;
import java.util.LinkedList;
import java.util.List;

@Path("/rent")
@Produces(MediaType.APPLICATION_JSON)
public class RentResource {
    @Inject
    RentRepository rentRepository;

    @Inject
    JsonWebToken jwt;

    @Inject
    SecurityIdentity securityIdentity;

    @POST
    @Path("/create")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRent(List<CreateRentDTO> rents) {
        try{
            rentRepository.create(rents);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @Deprecated
    @POST
    @Path("/createempty")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
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
    @Authenticated
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
    @Authenticated
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAll(RentFilters filters){
        List<RentByStudentDTO> result;
        try{
            result = rentRepository.getAll(filters);
        }catch (CCException ex){
            ex.printStackTrace();
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
    public Response getById(@PathParam("id") Long id) {
        RentDTO rent;
        try {
            rent = rentRepository.getByIdCensored(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(rent);
    }

    /**
     * For external confirmation
     */
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
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
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
    @Path("/getbyid/{id: [0-9]+}/externalconfirmordecline")
    public Response externalConfirmOrDeclineRent(@PathParam("id") Long id, RentIdsDTO data) {
        try {
            rentRepository.externalConfirmOrDeclineRent(id, data);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/confirm")
    @Authenticated
    public Response confirm(@PathParam("id") Long id) {
        try {
            rentRepository.confirmRent(id, jwt.getSubject());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/decline")
    @Authenticated
    public Response decline(@PathParam("id") Long id, JsonObject data) {
        try {
            rentRepository.declineRent(id, data.getString("message"), jwt.getSubject());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @PUT
    @Path("/getbyid/{id: [0-9]+}/return")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response returnRent(@PathParam("id") Long id) {
        try {
            rentRepository.returnRent(id, jwt.getSubject());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @PUT
    @Path("/getbyid/{id: [0-9]+}/remove")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response remove(@PathParam("id") Long id) {
        try{
            rentRepository.remove(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    //TODO check if both updates are needed

    @PUT
    @Path("/getbyid/{id: [0-9]+}/update/")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response update(@PathParam("id") Long id, JsonObject rent) {
        try {
            rentRepository.update(id, rent);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @PUT
    @Path("/getbyid/{id: [0-9]+}/update/{property}")
    @Blocking
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
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
    @Authenticated
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
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response importCSV(@RestForm File file){
        try{
            rentRepository.importRents(file);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

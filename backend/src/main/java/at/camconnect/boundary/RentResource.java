package at.camconnect.boundary;

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

@Path("/rent")
public class RentResource {
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
    @Path("/createempty")
    @Transactional
    public Response createRentEmpty (){
        rentRepository.createEmpty();
        return Response.ok().build();
    }

    @GET
    @Path("/getall")
    public List<Rent> getAll() {
        return rentRepository.getAll();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id")Long id) {
        try{
            rentRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/sendconfirmation")
    public Response sendConfirmation(@PathParam("id")Long id) {
        try{
            rentRepository.sendConfirmation(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/confirm")
    public Response confirm(@PathParam("id")Long id, JsonObject jsonObject){
        try {
            rentRepository.confirm(id, jsonObject);
        } catch(CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/getbyid/{id: [0-9]+}/return")
    public Response returnRent(@PathParam("id")Long id, JsonObject jsonObject){
        try {
            rentRepository.returnRent(id, jsonObject);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    public Response remove(@PathParam("id")Long id) {
        return rentRepository.remove(id);
    }

    //region updates
    @POST
    @Transactional
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update (@PathParam("id")Long id, JsonObject rent){
        try{
            rentRepository.update(id, rent);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/student")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setStudent(@PathParam("id")Long id, JsonObject student) {
        rentRepository.setStudent(id, student.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/teacherstart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setTeacherStart(@PathParam("id")Long id, JsonObject teacher) {
        rentRepository.setTeacherStart(id, teacher.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/teacherend")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setTeacherEnd(@PathParam("id")Long id, JsonObject teacher) {
        rentRepository.setTeacherEnd(id, teacher.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/device")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setDevice(@PathParam("id")Long id, JsonObject device) {
        rentRepository.setDevice(id, device.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentstart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentStart(@PathParam("id")Long id, JsonObject rentStart) {
        rentRepository.setRentStart(id, rentStart.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentendplanned")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRendEndPlanned(@PathParam("id")Long id, JsonObject rentEndPlanned) {
        rentRepository.setRentEndPlanned(id, rentEndPlanned.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentendactual")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentEndActual(@PathParam("id")Long id, JsonObject rentEndActual) {
        rentRepository.setRentEndActual(id, rentEndActual.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/note")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setNote(@PathParam("id")Long id, JsonObject note) {
        rentRepository.setNote(id, note.getString("value"));
        return Response.ok().build();
    }
    //endregion
}

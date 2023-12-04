package at.camconnect.boundary;

import at.camconnect.enums.RentStatusEnum;
import at.camconnect.errorSystem.CCException;
import at.camconnect.errorSystem.CCResponse;
import at.camconnect.model.Rent;
import at.camconnect.repository.RentRepository;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.MailTemplate;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.Location;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailMessage;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/rent")
public class RentResource {
    @Inject
    RentRepository rentRepository;

    @Inject
    MailClient client;

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
    public Rent getById(@PathParam("id")long id) {
        return rentRepository.getById(id);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/sendconfirmation/{itUser}")
    public Response sendConfirmation(@PathParam("id")long id, @PathParam("itUser")String itUser) {
        try{
            rentRepository.setVerificationMessage(id, RentStatusEnum.WAITING);
            client.sendMail(rentRepository.getMailMessage(id, itUser));
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("getbyid/{id: [0-9]+}/confirm/{verificationCode}/{verificationMessage}/{status}") //todo verificationMessage optional
    public Response setConfirmationStatus(@PathParam("id")long id, @PathParam("verificationCode")String code,
                                          @PathParam("verificationMessage")String message, @PathParam("status")String status){
        try {
            rentRepository.setConfirmationStatus(id, RentStatusEnum.valueOf(status), code, message);
        } catch(CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response remove(@PathParam("id")long id) {
        rentRepository.remove(id);
        return Response.ok().build();
    }

    //region updates
    @POST
    @Transactional
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateRent (@PathParam("id")long id, JsonObject rent){
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
    public Response setStudent(@PathParam("id")long id, JsonObject student) {
        rentRepository.setStudent(id, student.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/teacherstart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setTeacherStart(@PathParam("id")long id, JsonObject teacher) {
        rentRepository.setTeacherStart(id, teacher.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/teacherend")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setTeacherEnd(@PathParam("id")long id, JsonObject teacher) {
        rentRepository.setTeacherEnd(id, teacher.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/device")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setDevice(@PathParam("id")long id, JsonObject device) {
        rentRepository.setDevice(id, device.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentstart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentStart(@PathParam("id")long id, JsonObject rentStart) {
        rentRepository.setRentStart(id, rentStart.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentendplanned")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRendEndPlanned(@PathParam("id")long id, JsonObject rentEndPlanned) {
        rentRepository.setRentEndPlanned(id, rentEndPlanned.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/rentendactual")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentEndActual(@PathParam("id")long id, JsonObject rentEndActual) {
        rentRepository.setRentEndActual(id, rentEndActual.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/note")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setNote(@PathParam("id")long id, JsonObject note) {
        rentRepository.setNote(id, note.getString("value"));
        return Response.ok().build();
    }
    //endregion
}

package at.camconnect.boundary;

import at.camconnect.model.Device;
import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import at.camconnect.repository.RentRepository;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/rent")
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
    @Path("/createempty")
    @Transactional
    public Response createRentEmpty (){
        rentRepository.createEmpty();
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

    // Setter
    //region
    @POST
    @Path("/update/{rentId}/student/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setStudent(@PathParam("rentId")long rentId, JsonObject student) {
        rentRepository.setStudent(rentId, student.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/teacher/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setTeacher(@PathParam("rentId")long rentId, JsonObject teacher) {
        rentRepository.setTeacher(rentId, teacher.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/device/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setDevice(@PathParam("rentId")long rentId, JsonObject device) {
        rentRepository.setDevice(rentId, device.getInt("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/rentstart/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentStart(@PathParam("rentId")long rentId, JsonObject rentStart) {
        rentRepository.setRentStart(rentId, rentStart.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/rentendplanned/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRendEndPlanned(@PathParam("rentId")long rentId, JsonObject rentEndPlanned) {
        rentRepository.setRentEndPlanned(rentId, rentEndPlanned.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/rentendactual/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRentEndActual(@PathParam("rentId")long rentId, JsonObject rentEndActual) {
        rentRepository.setRentEndActual(rentId, rentEndActual.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/status/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setStatus(@PathParam("rentId")long rentId, JsonObject status) {
        rentRepository.setStatus(rentId, status.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/update/{rentId}/note/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setNote(@PathParam("rentId")long rentId, JsonObject note) {
        rentRepository.setNote(rentId, note.getString("value"));
        return Response.ok().build();
    }
    //endregion

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

    // Getter
    //region
    @GET
    @Path("/get/{rentId}/student")
    public Student getStudent(@PathParam("rentId")long rentId) {
        return rentRepository.getStudent(rentId);
    }

    @GET
    @Path("/get/{rentId}/teacher")
    public Teacher getTeacher(@PathParam("rentId")long rentId) {
        return rentRepository.getTeacher(rentId);
    }

    @GET
    @Path("/get/{rentId}/student")
    public Device getDevice(@PathParam("rentId")long rentId) {
        return rentRepository.getDevice(rentId);
    }

    @GET
    @Path("/get/{rentId}/rentstart")
    public String getRentStart(@PathParam("rentId")long rentId) {
        return rentRepository.getRentStart(rentId);
    }

    @GET
    @Path("/get/{rentId}/rentendplanned")
    public String getRentEndPlanned(@PathParam("rentId")long rentId) {
        return rentRepository.getRentEndPlanned(rentId);
    }

    @GET
    @Path("/get/{rentId}/rentendactual")
    public String getRentEndActual(@PathParam("rentId")long rentId) {
        return rentRepository.getRentEndActual(rentId);
    }

    @GET
    @Path("/get/{rentId}/status")
    public String getStatus(@PathParam("rentId")long rentId) {
        return rentRepository.getStatus(rentId);
    }

    @GET
    @Path("/get/{rentId}/note")
    public String getNote(@PathParam("rentId")long rentId) {
        return rentRepository.getNote(rentId);
    }
    //endregion
}

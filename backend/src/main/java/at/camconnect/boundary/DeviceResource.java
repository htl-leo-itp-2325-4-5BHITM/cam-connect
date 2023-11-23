package at.camconnect.boundary;

import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/device")
public class DeviceResource {
    @Inject
    DeviceRepository deviceRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @Produces
    public Response createDevice(Device d){
        deviceRepository.create(d);
        return Response.ok().build();
    }

    @GET
    @Path("/getall")
    public List<Device> getAll() {
        return deviceRepository.getAll();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Produces
    public Device getById(@PathParam("id")long id) {
        return deviceRepository.getById(id);
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response remove(@PathParam("id")long id){
        deviceRepository.remove(id);
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response update(@PathParam("id")Long id, JsonObject data){
        deviceRepository.update(id, data);
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/number")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response updateNumber(@PathParam("id")Long id, JsonObject data){
        deviceRepository.setNumber(id, data.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/serial")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response updateSerial(@PathParam("id")Long id, JsonObject data){
        deviceRepository.setSerial(id, data.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/note")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response updateNote(@PathParam("id")Long id, JsonObject data){
        deviceRepository.setNote(id, data.getString("value"));
        return Response.ok().build();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/type")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response updateType(@PathParam("id")Long id, JsonObject data){
        deviceRepository.setType(id, data.getInt("value"));
        return Response.ok().build();
    }
}

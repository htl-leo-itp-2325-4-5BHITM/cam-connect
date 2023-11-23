package at.camconnect.boundary;

import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
import jakarta.inject.Inject;
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
    @Path("/getbyid/{id: [0-9]+}/update/serial")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces
    @Transactional
    public Response update(Device d){
        deviceRepository.update(d);
        return Response.ok().build();
    }
}

package at.camconnect.boundary;

import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.repository.DeviceTypeRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/devicetype")
public class DeviceTypeResource {
    @Inject
    DeviceTypeRepository deviceTypeRepository;
    @POST
    @Path("/create/{type: [A-z]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("type") DeviceTypeEnum type, JsonObject data){
        deviceTypeRepository.create(type, data);
        return Response.ok().build();
    }
}

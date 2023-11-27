package at.camconnect.boundary;

import at.camconnect.CCError;
import at.camconnect.CCException;
import at.camconnect.CCResponse;
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
        CCError error = new CCError(1000);

        try{
            deviceTypeRepository.create(type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, JsonObject data){
        try{
            deviceTypeRepository.update(id, data);
        }catch (CCException ex){
            return new CCError(ex).toResponse();
        }

        return CCResponse.ok();
    }
}

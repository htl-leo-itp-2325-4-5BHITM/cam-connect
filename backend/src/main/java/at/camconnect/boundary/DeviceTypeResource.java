package at.camconnect.boundary;

import at.camconnect.errorSystem.CCError;
import at.camconnect.errorSystem.CCException;
import at.camconnect.errorSystem.CCResponse;
import at.camconnect.enums.DeviceTypeEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceTypeRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/devicetype")
public class DeviceTypeResource {
    @Inject
    DeviceTypeRepository deviceTypeRepository;
    @POST
    @Path("/create/{type: [A-z]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("type") DeviceTypeEnum type, JsonObject data){
        try{
            deviceTypeRepository.create(type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getById(@PathParam("id") Long id){
        DeviceType result;
        try{
            result = deviceTypeRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/{type: [A-z]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, @PathParam("type") DeviceTypeEnum type, JsonObject data){
        try{
            deviceTypeRepository.update(id, type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

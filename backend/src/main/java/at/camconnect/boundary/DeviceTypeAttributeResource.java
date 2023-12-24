package at.camconnect.boundary;

import at.camconnect.enums.DeviceTypeAttributeEnum;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.repository.DeviceTypeAttributeRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/devicetype/attribute")
public class DeviceTypeAttributeResource {
    @Inject
    DeviceTypeAttributeRepository deviceTypeAttributeRepository;

    @POST
    @Path("/create/{type: [A-z]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("type") DeviceTypeAttributeEnum type, JsonObject data){
        DeviceTypeAttribute result;
        try{
            result = deviceTypeAttributeRepository.create(type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Transactional
    public Response getById(@PathParam("id") Long id){
        DeviceTypeAttribute result;
        try{
            result = deviceTypeAttributeRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    @Transactional
    public Response getall(){
        List<DeviceTypeAttribute> result;
        try{
            result = deviceTypeAttributeRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Transactional
    public Response remove(@PathParam("id") Long id){
        try{
            deviceTypeAttributeRepository.remove(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

package at.camconnect.boundary;

import at.camconnect.dtos.DeviceTypeAttributeCollection;
import at.camconnect.dtos.DeviceTypeAttributeDTO;
import at.camconnect.enums.DeviceTypeAttributeEnum;
import at.camconnect.model.DeviceTypeAttribute;
import at.camconnect.repository.DeviceTypeAttributeRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/devicetype/attribute")
@Produces(MediaType.APPLICATION_JSON)
public class DeviceTypeAttributeResource {
    @Inject
    DeviceTypeAttributeRepository deviceTypeAttributeRepository;

    @POST
    @Path("/create/{type: [A-z]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response create(@PathParam("type") DeviceTypeAttributeEnum type, JsonObject data){//leave as JsonObject not DTO
        DeviceTypeAttribute result;
        try{
            result = deviceTypeAttributeRepository.create(type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    @Authenticated
    public Response getall(){
        DeviceTypeAttributeCollection result;
        try{
            result = deviceTypeAttributeRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
    public Response getById(@PathParam("id") Long id){
        DeviceTypeAttribute result;
        try{
            result = deviceTypeAttributeRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response update(@PathParam("id") Long id, DeviceTypeAttributeDTO data){
        DeviceTypeAttribute result;
        try{
            result = deviceTypeAttributeRepository.update(id, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }


    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response remove(@PathParam("id") Long id){
        try{
            deviceTypeAttributeRepository.remove(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

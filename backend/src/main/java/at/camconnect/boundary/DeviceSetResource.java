package at.camconnect.boundary;

import at.camconnect.dtos.deviceSet.DeviceSetCreateDTO;
import at.camconnect.dtos.filters.DeviceTypeFilters;
import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceSetRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("deviceset")
public class DeviceSetResource {
    @Inject
    DeviceSetRepository deviceSetRepository;

    @GET
    @Path("/getall")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAll(){
        try{
            return CCResponse.ok(deviceSetRepository.getAll());
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @POST
    @Path("/getallfull")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAll(DeviceTypeFilters filters){
        try{
            return CCResponse.ok(deviceSetRepository.getAllFull(filters));
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @POST
    @Path("/create")
    public Response create(DeviceSetCreateDTO dto){
        try{
            deviceSetRepository.create(dto);
            return CCResponse.ok();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @PUT
    @Path("/update")
    public Response update(DeviceSetCreateDTO dto){
        try{
            deviceSetRepository.update(dto);
            return CCResponse.ok();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @PUT
    @Path("/delete")
    public Response delete(@QueryParam("id") Long id){
        try{
            deviceSetRepository.delete(id);
            return CCResponse.ok();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @POST
    @Path("getbyid/{id: [0-9]+}/tag/{tagId: [0-9]+}/toggle")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTag(@PathParam("id") Long id, @PathParam("tagId") Long tagId){
        DeviceType result;
        try{
            deviceSetRepository.toggleTag(id, tagId);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

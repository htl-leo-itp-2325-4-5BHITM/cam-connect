package at.camconnect.boundary;

import at.camconnect.dtos.deviceSet.DeviceSetDTO;
import at.camconnect.dtos.filters.DeviceTypeFilters;
import at.camconnect.model.DeviceSet;
import at.camconnect.repository.DeviceSetRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response create(DeviceSetDTO dto){
        try{
            DeviceSet deviceSet = deviceSetRepository.create(dto);
            return CCResponse.ok(deviceSet);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @PUT
    @Path("getbyid/{id: [0-9]+}/update")
    public Response update(@PathParam("id") Long id, DeviceSetDTO dto){
        try{
            deviceSetRepository.update(id, dto);
            return CCResponse.ok();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
    }

    @PUT
    @Path("getbyid/{id: [0-9]+}/delete")
    public Response delete(@PathParam("id") Long id){
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
        try{
            deviceSetRepository.toggleTag(id, tagId);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

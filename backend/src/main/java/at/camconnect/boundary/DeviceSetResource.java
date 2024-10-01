package at.camconnect.boundary;

import at.camconnect.dtos.deviceSet.DeviceSetCreateDTO;
import at.camconnect.model.Device;
import at.camconnect.repository.DeviceSetRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("deviceset")
public class DeviceSetResource {
    //TODO this and the repo

    @Inject
    DeviceSetRepository deviceSetRepository;

    @GET
    @Path("/getall")
    public Response getAll() {
        List<Device> devices;
        try{
            return CCResponse.ok(deviceSetRepository.getAll());
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
}

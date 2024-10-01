package at.camconnect.boundary;

import at.camconnect.model.Device;
import at.camconnect.repository.DeviceSetRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
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
}

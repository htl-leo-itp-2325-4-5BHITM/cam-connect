package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.dtos.DeviceDTO;
import at.camconnect.dtos.DeviceSearchDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.util.List;

@Path("/device")
@Produces(MediaType.APPLICATION_JSON)
public class DeviceResource {
    @Inject
    DeviceRepository deviceRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response createDevice(DeviceDTO d){
        try {
            deviceRepository.createByDTO(d);
            return CCResponse.ok();
        } catch (CCException ex) {
            ex.printStackTrace();
            return CCResponse.error(ex);
        }
    }

    @GET
    @Path("/getall")
    @Authenticated
    public Response getAll() {
        List<Device> devices;
        try{
            devices = deviceRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(devices);
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Authenticated
    public Response search(DeviceSearchDTO data){
        List<AutocompleteNumberOptionDTO<Device>> result;
        try{
            result = deviceRepository.search(data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
    public Response getById(@PathParam("id") Long id) {
        Device result;
        try{
            result = deviceRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response remove(@PathParam("id") Long id){
        try {
            deviceRepository.remove(id);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response update(@PathParam("id")Long id, DeviceDTO deviceDTO){
        Device device;
        try {
            device = deviceRepository.update(id, deviceDTO);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok(device);
    }

    @GET
    @Path("/getbynumberandtype/{number}/{type_id: [0-9]+}")
    @Authenticated
    public Response getByNumberAndType(@PathParam("number") String number, @PathParam("type_id") Long type_id) {
        Device result;
        try{
            result = deviceRepository.getByNumberAndType(number, type_id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/validatenumberandtype/{number}/{type_id}")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response validateNumberAndType(@PathParam("number") String number, @PathParam("type_id") Long type_id) {
        boolean result;
        try{
            result = deviceRepository.validateNumberAndType(number, type_id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/importcsv")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response importCSV(@RestForm File file) {
        try{
            deviceRepository.importDevices(file);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/exportcsv")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response exportCSV() {
        try {
            return deviceRepository.exportAllDevices();
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }
}

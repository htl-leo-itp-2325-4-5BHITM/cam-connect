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
import jakarta.transaction.Transactional;
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

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
    public Response getById(@PathParam("id")long id) {
        Device result;
        try{
            result = deviceRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbynumberandtype/{number}/{type_id: [0-9]+}")
    @Authenticated
    public Response getByNumberAndType(@PathParam("number") String number, @PathParam("type_id") long type_id) {
        Device result;
        try{
            result = deviceRepository.getByNumberAndType(number, type_id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
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
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response remove(@PathParam("id")long id){
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
        try {
            deviceRepository.update(id, deviceDTO);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/number")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response updateNumber(@PathParam("id")Long id, DeviceDTO deviceDTO){
        try {
            deviceRepository.setNumber(id, deviceDTO.number());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/serial")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response updateSerial(@PathParam("id")Long id, DeviceDTO deviceDTO){
        try {
            deviceRepository.setSerial(id, deviceDTO.serial());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/note")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response updateNote(@PathParam("id")Long id, DeviceDTO deviceDTO){
        try {
            deviceRepository.setNote(id, deviceDTO.note());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/update/type")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response updateType(@PathParam("id")Long id, DeviceDTO deviceDTO){
        try {
            deviceRepository.setType(id, deviceDTO.type_id());
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
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
    @Path("/import")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response uploadCsvFile(@RestForm File file) {
        try{
            deviceRepository.importDevices(file);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/getcsv")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response exportAllDevices() {
        try {
            return deviceRepository.exportAllDevices();
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }
}

package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteOptionDTO;
import at.camconnect.dtos.DeviceDTO;
import at.camconnect.dtos.DeviceSearchDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
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
    public Response createDevice(Device d){
        try {
            deviceRepository.create(d);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getall")
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
    @Transactional
    public Response search(DeviceSearchDTO data){
        List<AutocompleteOptionDTO<Device>> result;
        try{
            result = deviceRepository.search(data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Consumes(MediaType.APPLICATION_JSON)
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
    //@RolesAllowed({"admin", "da"})
    @Path("/import")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
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
    public Response exportAllDevices() {
        try {
            return deviceRepository.exportAllDevices();
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }
}

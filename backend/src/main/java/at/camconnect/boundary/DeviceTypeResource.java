package at.camconnect.boundary;

import at.camconnect.dtos.*;
import at.camconnect.dtos.deviceType.*;
import at.camconnect.dtos.filters.DeviceTypeFilters;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceTypeRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

@Path("/devicetype")
@Produces(MediaType.APPLICATION_JSON)
public class DeviceTypeResource {
    @Inject
    DeviceTypeRepository deviceTypeRepository;

    @POST
    @Path("/create/{type: [A-z]+}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("type") DeviceTypeVariantEnum type, JsonObject data){//leave as JsonObject NOT DTO
        DeviceType result;
        try{
            result = deviceTypeRepository.create(type, data);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    @Transactional
    public Response getAll(){
        DeviceTypeCollection result;
        try{
            result = deviceTypeRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/getallfull")
    @Transactional
    public Response getAllFull(DeviceTypeFilters deviceTypeFilters){
        System.out.println("Reached getAllFull Endpoint at " + LocalDateTime.now());
        List<DeviceTypeFullDTO> result;
        try{
            result = deviceTypeRepository.getAllFull(deviceTypeFilters);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        System.out.println("Sending data from getAllFull Endpoint at " + LocalDateTime.now());
        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Transactional
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
    @Path("/getbyid/{id: [0-9]+}/update/")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, DeviceTypeGlobalObjectsDTO data){//leave as JsonObject NOT DTO
        DeviceType result;
        try{
            result = deviceTypeRepository.update(id, data);
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
            deviceTypeRepository.remove(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response search(JsonObject data){
        List<AutocompleteOptionDTO<DeviceTypeMinimalDTO>> result;
        try{
            result = deviceTypeRepository.search(data.getString("searchTerm"));;
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/getcsv")
    public Response exportAllDeviceVariants() {
        try {
            return deviceTypeRepository.exportAllDeviceTypeVariants();
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/getcsv/{type}")
    public Response exportDeviceTypeVariant(@PathParam("type")DeviceTypeVariantEnum variant) {
        try {
            return deviceTypeRepository.exportDeviceTypeVariant(variant);
        } catch (CCException ex) {
            return CCResponse.error(ex);
        }
    }

    @POST
    @Path("/import/{type}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadCsvFile(@RestForm File file, @PathParam("type")String type) {
        try{
            deviceTypeRepository.importDeviceTypes(file, type);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

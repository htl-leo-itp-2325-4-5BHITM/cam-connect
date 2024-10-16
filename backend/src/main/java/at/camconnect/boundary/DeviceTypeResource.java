package at.camconnect.boundary;

import at.camconnect.dtos.*;
import at.camconnect.dtos.deviceType.*;
import at.camconnect.dtos.filters.DeviceTypeFilters;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceTypeRepository;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
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
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response create(@PathParam("type") DeviceTypeVariantEnum type, JsonObject data){//leave as JsonObject NOT DTO
        DeviceType result;
        try{
            result = deviceTypeRepository.create(type, data);
        }catch (CCException ex){
            ex.printStackTrace();
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    @Authenticated
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
    @Authenticated
    public Response getAllFull(DeviceTypeFilters deviceTypeFilters){
        List<DeviceTypeFullDTO> result;
        try{
            result = deviceTypeRepository.getAllFull(deviceTypeFilters);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
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
    @Path("/getbyid/{id: [0-9]+}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response update(@PathParam("id") Long id, DeviceTypeGlobalObjectsDTO data){
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
    @Authenticated
    public Response search(JsonObject data){
        List<AutocompleteNumberOptionDTO<DeviceTypeMinimalDTO>> result;
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
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
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
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
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
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response uploadCsvFile(@RestForm File file, @PathParam("type")String type) {
        try{
            deviceTypeRepository.importDeviceTypes(file, type);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("getbyid/{id: [0-9]+}/tag/{tagId: [0-9]+}/toggle")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTag(@PathParam("id") Long id, @PathParam("tagId") Long tagId){
        DeviceType result;
        try{
            deviceTypeRepository.toggleTag(id, tagId);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok();
    }
}

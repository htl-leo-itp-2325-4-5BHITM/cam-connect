package at.camconnect.boundary;

import at.camconnect.dtos.*;
import at.camconnect.dtos.deviceType.DeviceTypeCollection;
import at.camconnect.dtos.deviceType.DeviceTypeFullDTO;
import at.camconnect.dtos.deviceType.DeviceTypeGlobalIdDTO;
import at.camconnect.dtos.deviceType.DeviceTypeMinimalDTO;
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

    @GET
    @Path("/getallfull")
    @Transactional
    public Response getAllFull(){
        List<DeviceTypeFullDTO> result;
        try{
            result = deviceTypeRepository.getAllFull();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

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
    @Path("/getbyid/{id: [0-9]+}/update")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, DeviceTypeGlobalIdDTO data){
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

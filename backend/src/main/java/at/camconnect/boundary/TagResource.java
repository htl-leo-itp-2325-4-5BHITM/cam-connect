package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.model.Tag;
import at.camconnect.repository.TagRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/tag")
@Produces(MediaType.APPLICATION_JSON)
public class TagResource {

    @Inject
    TagRepository tagRepository;

    @GET
    @Path("/getall")
    @Authenticated
    public Response getAllTags(){
        List<Tag> tagList;
        try{
            tagList = tagRepository.getAll();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(tagList);
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Authenticated
    public Response search(JsonObject data){
        List<AutocompleteNumberOptionDTO<Tag>> result;
        try{
            result = tagRepository.search(data.getString("searchTerm"));
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response createTag(Tag t){
        try{
            tagRepository.addTag(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    @Authenticated
    public Response getById(@PathParam("id") Long id){
        Tag tag;
        try{
            tag = tagRepository.getById(id);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(tag);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/update")
    @Authenticated
    public Response update(@PathParam("id") Long id){
        try{

        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}/remove")
    @Authenticated
    public Response delete(@PathParam("id") Long id){
        try{

        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

package at.camconnect.boundary;

import at.camconnect.model.Tag;
import at.camconnect.repository.TagRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
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

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createTag(Tag t){
        try{
            tagRepository.addTag(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTag(Tag t){
        try{
            tagRepository.deleteTag(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    //TODO this is definitely not correct..
    @POST
    @Path("/update{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response upateTag(Tag t){
        try{
            tagRepository.updateTag(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id")long id){
        Tag tag;
        try{
            tag = tagRepository.getById(id);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(tag);
    }
    @GET
    @Path("/getall")
    public Response getAllTags(){
        List<Tag> tagList;
        try{
            tagList = tagRepository.getAll();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(tagList);
    }
}

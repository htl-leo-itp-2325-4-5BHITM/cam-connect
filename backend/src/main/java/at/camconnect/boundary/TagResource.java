package at.camconnect.boundary;

import at.camconnect.model.Tag;
import at.camconnect.repository.TagRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/tag")
public class TagResource {

    @Inject
    TagRepository tagRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createTag(Tag t){
        tagRepository.addTag(t);
        return Response.ok().build();
    }

    @POST
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTag(Tag t){
        tagRepository.deleteTag(t);
        return Response.ok().build();
    }

    @POST
    @Path("/update{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response upateTag(Tag t){
        tagRepository.updateTag(t);
        return Response.ok().build();
    }
    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Tag getById(@PathParam("id")long id){
        return tagRepository.getTagById(id);
    }
    @GET
    @Path("/getall")
    public List<Tag> getAllTags(){
        return tagRepository.getAll();
    }
}

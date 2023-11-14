package at.camconnect.boundary;

import at.camconnect.model.Tag;
import at.camconnect.repository.TagRepository;
import jakarta.inject.Inject;
import jakarta.persistence.UniqueConstraint;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/tag")
public class TagRessource {

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
}

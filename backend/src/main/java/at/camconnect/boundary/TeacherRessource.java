package at.camconnect.boundary;

import at.camconnect.model.Teacher;
import at.camconnect.repository.TeacherRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/teacher")
public class TeacherRessource {
    @Inject
    TeacherRepository teacherRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createTeacher(Teacher t){
        teacherRepository.create(t);
        return Response.ok().build();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTeacher(Teacher t){
        teacherRepository.remove(t);
        return Response.ok().build();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateTeacher(Teacher t){
        teacherRepository.update(t);
        return Response.ok().build();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Teacher getById(@PathParam("id")long id) {
        return teacherRepository.getById(id);
    }

    @GET
    @Path("/getall")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Teacher> getAll() {
        return teacherRepository.getAll();
    }


}

package at.camconnect.boundary;

import at.camconnect.model.Teacher;
import at.camconnect.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/teacher")
public class TeacherRessource {
    @Inject
    TeacherRepository teacherRepository;

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Teacher getById(@PathParam("id")long id) {
        return teacherRepository.getById(id);
    }

    @GET
    @Path("/searchbykey/{key: [A-z0-9]+}")
    public List<Teacher> getById(@PathParam("key")String key) {
        return teacherRepository.searchByKey(key);
    }

    @GET
    @Path("/getall")
    public List<Teacher> getAll() {
        return teacherRepository.getAll();
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createStudent(Teacher teacher){
        teacherRepository.create(teacher);
        return Response.ok().build();
    }
}

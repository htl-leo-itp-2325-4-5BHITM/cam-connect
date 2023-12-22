package at.camconnect.boundary;

import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Teacher;
import at.camconnect.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
/*import org.jboss.resteasy.reactive.MultipartForm;*/

import java.io.File;
import java.util.List;

@Path("/teacher")
public class TeacherResource {
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

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    public List<Teacher> search(JsonObject data){
        return teacherRepository.search(data);
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

    @POST
    @Path("/import")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadCsvFile(@RestForm File file) {
        try{
            teacherRepository.importTeachers(file);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

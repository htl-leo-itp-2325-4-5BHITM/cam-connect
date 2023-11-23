package at.camconnect.boundary;

import at.camconnect.model.Teacher;
import at.camconnect.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
/*import org.jboss.resteasy.reactive.MultipartForm;*/

import java.util.List;

@Path("/api/teacher")
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
    @Path("/importteacher")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Response uploadCsvFile(/*@MultipartForm FormDataDTO formData*/) {
        /*// FormData enthält die Informationen zur Datei
        InputStream fileInputStream = formData.file();
        String fileName = formData.filename();

        // Hier wird die CSV-Datei an die Repository-Klasse weitergeleitet
        try {
            teacherRepository.importTeachers(fileInputStream);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).build();
        }*/
        return Response.serverError().build();
    }
}

package at.camconnect.boundary;

import at.camconnect.dtos.TeacherDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Teacher;
import at.camconnect.repository.TeacherRepository;
import jakarta.inject.Inject;
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
        try{
            teacherRepository.create(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
    
    @POST   
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTeacher(Teacher t){
        try{
            teacherRepository.remove(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateTeacher(Teacher t){
        try{
            teacherRepository.update(t);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(TeacherDTO teacherDTO){
        List<Teacher> teacherList;
        try{
            teacherList = teacherRepository.search(teacherDTO);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(teacherList);
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id")long id) {
        Teacher teacher;
        try{
            teacher = teacherRepository.getById(id);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(teacher);
    }

    @GET
    @Path("/getall")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        List<Teacher> teacherList;
        try{
            teacherList = teacherRepository.getAll();
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(teacherList);
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

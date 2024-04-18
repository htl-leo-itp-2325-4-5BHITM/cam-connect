package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteOptionDTO;
import at.camconnect.dtos.StudentDTO;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.model.Student;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.util.List;

@Path("/student")
@Produces(MediaType.APPLICATION_JSON)
public class StudentResource {
    @Inject
    StudentRepository studentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createStudent(Student s){
        try{
            studentRepository.create(s);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeStudent(Student s){
        try{
            studentRepository.remove(s);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateStudent(Student s){
        try{
            studentRepository.update(s);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Response getById(@PathParam("id")Long id) {
        Student student;
        try{
            student = studentRepository.getById(id);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(student);
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response search(JsonObject data){
        List<AutocompleteOptionDTO> result;
        try{
            result = studentRepository.search(data.getString("searchTerm"));;
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getall")
    public Response getAll() {
        List<Student> studentList;
        try{
            studentList = studentRepository.getAll();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(studentList);
    }

    @POST
    @Path("/import")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadCsvFile(@RestForm File file) {
        try{
            studentRepository.importStudents(file);
        }catch (CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok();
    }
}

package at.camconnect.boundary;

import at.camconnect.model.Student;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/student")
public class StudentRessource {
    @Produces
    public String studentDefault(){
        return "Hey from Students";
    }
    @Inject
    StudentRepository studentRepository;

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Student getById(@PathParam("id")long id) {
        return studentRepository.getById(id);
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public List<Student> search(JsonObject data){
        return studentRepository.search(data);
    }

    @GET
    @Path("/getall")
    public List<Student> getAll() {
        return studentRepository.getAll();
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createStudent(Student student){
        studentRepository.create(student);
        return Response.ok().build();
    }
}

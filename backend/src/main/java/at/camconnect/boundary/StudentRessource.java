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

@Path("/api/student")
public class StudentRessource {
    @Inject
    StudentRepository studentRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createStudent(Student s){
        studentRepository.create(s);
        return Response.ok().build();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeStudent(Student s){
        studentRepository.remove(s);
        return Response.ok().build();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateStudent(Student s){
        studentRepository.update(s);
        return Response.ok().build();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")

    public Student getById(@PathParam("id")long id) {
        return studentRepository.getById(id);
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    public List<Student> search(JsonObject data){
        return studentRepository.search(data);
    }

    @GET
    @Path("/getall")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Student> getAll() {
        return studentRepository.getAll();
    }
}

package at.camconnect.boundary;

import at.camconnect.model.Student;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/student")
public class StudentBoundary {

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

    //TODO why the fuck wont this take my input
    @Transactional
    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public String createStudent(Student student){
        studentRepository.create(student);
        return "student created";
    }

    @GET
    @Path("/getall")
    public List<Student> getAll() {
        return studentRepository.getAll();
    }
}

package at.camconnect.boundary;

import at.camconnect.dtos.FormDataDTO;
import at.camconnect.model.Student;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.InputStream;
import java.util.List;
import org.jboss.resteasy.reactive.MultipartForm;

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


    @POST
    @Path("/importstudents")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Response uploadCsvFile(@MultipartForm FormDataDTO formData) {
        // FormData enthält die Informationen zur Datei
        InputStream fileInputStream = formData.file();
        String fileName = formData.filename();

        // Hier wird die CSV-Datei an die Repository-Klasse weitergeleitet
        try {
            studentRepository.importStudents(fileInputStream);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).build();
        }
    }


}

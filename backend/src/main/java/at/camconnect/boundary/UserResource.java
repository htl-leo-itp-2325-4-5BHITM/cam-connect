package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.model.User;
import at.camconnect.repository.UserRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("user")
public class UserResource {
    @Inject
    UserRepository userRepository;

    @POST
    @Path("/searchforstudent")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response searchForStudent(JsonObject data){
        List<AutocompleteNumberOptionDTO> result;
        try{
            result = userRepository.searchForStudent(data.getString("searchTerm"));;
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getallstudents")
    public Response getAllStudents() {
        List<User> studentList;
        try{
            studentList = userRepository.getAllStudents();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(studentList);
    }

    @POST
    @Path("/searchforteacher")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response searchForTeacher(JsonObject data){
        List<User> result;
        try{
            result = userRepository.searchForTeacher(data.getString("searchTerm"));;
        }catch (CCException ex){
            return CCResponse.error(ex);
        }

        return CCResponse.ok(result);
    }

    @GET
    @Path("/getallteachers")
    public Response getAllTeachers() {
        List<User> studentList;
        try{
            studentList = userRepository.getAllTeachers();
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(studentList);
    }
}

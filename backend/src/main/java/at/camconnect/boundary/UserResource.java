package at.camconnect.boundary;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.dtos.KeycloakUser;
import at.camconnect.model.User;
import at.camconnect.repository.UserRepository;
import at.camconnect.responseSystem.CCException;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.services.UserSyncService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Path("user")
public class UserResource {
    @Inject
    UserRepository userRepository;

    @Inject
    UserSyncService userSyncService;

    AtomicBoolean isRunning = new AtomicBoolean(false);

    @PUT
    @Path("loadfromldap")
    @RolesAllowed({"camconnect-admin", "medt-teacher"})
    public Response loadFromLDAP(){
        if (isRunning.compareAndSet(false, true)) {
            List<KeycloakUser> users;
            try{
                users = userSyncService.syncUsersWithLDAP();
            }catch (CCException ex){
                return CCResponse.error(ex);
            }

            isRunning.set(false);

            return CCResponse.ok(users);
        } else {
            return CCResponse.error(new CCException(1201, "users are already being loaded"));
        }
    }

    @GET
    @Path("/getbyid/{id}")
    @Authenticated
    public Response getById(@PathParam("id") String id) {
        User user;
        try{
            user = userRepository.getById(id);
        } catch(CCException ex){
            return CCResponse.error(ex);
        }
        return CCResponse.ok(user);
    }

    @POST
    @Path("/searchforstudent")
    @Consumes(MediaType.APPLICATION_JSON)
    @Authenticated
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
    @Authenticated
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
    @Authenticated
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
    @Authenticated
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

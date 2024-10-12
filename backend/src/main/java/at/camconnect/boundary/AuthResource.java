package at.camconnect.boundary;

import at.camconnect.dtos.LoginRequest;
import at.camconnect.enums.UserRoleEnum;
import at.camconnect.responseSystem.CCResponse;
import at.camconnect.responseSystem.CCStatus;
import at.camconnect.services.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.json.internal.json_simple.parser.JSONParser;

import java.io.Serializable;
import java.time.*;
import java.util.Base64;
import java.util.List;

@Path("/auth")
public class AuthResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    AuthService authService;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest loginRequest) {
        try {
            Response keycloakResponse = authService.requestLogin(loginRequest.username(), loginRequest.password());

            if (keycloakResponse.getStatus() != 200) {
                return CCResponse.error(new CCStatus(1206, "Invalid login credentials"));
            }

            String responseString = keycloakResponse.readEntity(String.class);

            JSONParser parser = new JSONParser();
            JSONObject responseJson = new JSONObject();
            try{
                responseJson = (JSONObject) parser.parse(responseString);
            }catch (org.jose4j.json.internal.json_simple.parser.ParseException e) {
                return CCResponse.error(new CCStatus(1207, "The login did not return a valid response"));
            }

            return CCResponse.ok(responseJson);
        } catch (Exception e) {
            return CCResponse.error(new CCStatus(1205, "Something went wrong during the login process"));
        }
    }


    @POST
    @Path("/validate")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.TEXT_PLAIN)
    public Response validateToken(String tokenString) {
        if (tokenString != null) {
            Base64.Decoder decoder = Base64.getUrlDecoder();

            String[] chunks = tokenString.split("\\.");

            String header = new String(decoder.decode(chunks[0]));
            String payload = new String(decoder.decode(chunks[1]));

            JSONParser parser = new JSONParser();
            JSONObject tokenPayload = new JSONObject();
            try{
                tokenPayload = (JSONObject) parser.parse(payload);
            }catch (org.jose4j.json.internal.json_simple.parser.ParseException e) {
                e.printStackTrace();
            }

            LocalDate expiration = LocalDateTime.ofEpochSecond((long) tokenPayload.get("exp"), 0, ZoneOffset.UTC).toLocalDate();

            if (expiration.isBefore(LocalDate.now())) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
            return Response.ok().build();
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @GET
    @Path("/role")
    @Authenticated
    public Response getUserRole() {
        UserRoleEnum role = UserRoleEnum.STUDENT;

        if(securityIdentity.hasRole("camconnect-admin"))
            role = UserRoleEnum.ADMIN;

        if(securityIdentity.hasRole("medt-teacher")){
            role = UserRoleEnum.MEDT_TEACHER;
        }

        //TODO THIS DOES NOR WORK YET - i dont know how to check for a teacher other then their email
        if(securityIdentity.hasRole("teacher")){
            role = UserRoleEnum.TEACHER;
        }

        return CCResponse.ok(role);
    }
}

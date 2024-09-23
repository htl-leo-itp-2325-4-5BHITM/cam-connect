package at.camconnect.boundary;

import at.camconnect.responseSystem.CCResponse;
import at.camconnect.responseSystem.CCStatus;
import at.camconnect.services.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.io.Serializable;
import java.time.LocalDate;

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

            String responseBody = keycloakResponse.readEntity(String.class);
            return CCResponse.ok(responseBody);
        } catch (Exception e) {
            return CCResponse.error(new CCStatus(1206, "Something went wrong during the login process"));
        }
    }

    @GET
    @Path("/validate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateToken() {
        if (jwt != null) {
            if (LocalDate.parse(String.valueOf(jwt.getExpirationTime())).isBefore(LocalDate.now())) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @GET
    @Path("/medt")
    @Produces(MediaType.APPLICATION_JSON)
    public Response medt() {
        if(securityIdentity.hasRole("medt-teacher")) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }

    public record LoginRequest(String username, String password) implements Serializable {
    }
}

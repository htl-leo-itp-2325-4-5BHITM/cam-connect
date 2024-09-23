package at.camconnect.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class AuthService {

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String AUTH_SERVER_URL;

    @ConfigProperty(name = "quarkus.oidc.client-id")
    String AUTH_CLIENT_ID;

    @ConfigProperty(name = "quarkus.oidc.client-secret")
    String AUTH_CLIENT_SECRET;

    public Response requestLogin(String username, String password) {
        try (Client client = ClientBuilder.newClient()) {
            Form form = new Form();
            form.param("client_id", AUTH_CLIENT_ID);
            form.param("client_secret", AUTH_CLIENT_SECRET);
            form.param("username", username);
            form.param("password", password);
            form.param("grant_type", "password");
            form.param("scope", "openid");

            Response keycloakResponse = client.target(String.format("%s/protocol/openid-connect/token", AUTH_SERVER_URL))
                    .request(MediaType.APPLICATION_FORM_URLENCODED)
                    .post(Entity.form(form));

            int status = keycloakResponse.getStatus();
            String responseBody = keycloakResponse.readEntity(String.class);

            return Response.status(status)
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("An error occurred during the login request.")
                    .build();
        }
    }
}

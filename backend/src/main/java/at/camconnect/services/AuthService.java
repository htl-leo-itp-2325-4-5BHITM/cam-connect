package at.camconnect.services;

import at.camconnect.dtos.KeycloakUser;
import at.camconnect.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.json.internal.json_simple.parser.JSONParser;

import java.util.List;

@ApplicationScoped
@Transactional
public class AuthService {

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    String AUTH_SERVER_URL;

    @ConfigProperty(name = "quarkus.oidc.base-url")
    String BASE_URL;

    @ConfigProperty(name = "quarkus.oidc.client-id")
    String AUTH_CLIENT_ID;

    @ConfigProperty(name = "quarkus.oidc.client-secret")
    String AUTH_CLIENT_SECRET;

    @Inject
    EntityManager em;

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

    public void persistUser(KeycloakUser user) {
        try{
            em.persist(new User(
                user.id(),
                user.getUserRole(),
                user.firstName(),
                user.lastName(),
                user.email(),
                user.username(),
                "unknown"
            ));
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public void syncUsersWithDatabase(String accessToken) {
        try (Client client = ClientBuilder.newClient()) {
            Response response = client.target(String.format("%s/admin/realms/%s/users?search=%s&max=1000", BASE_URL, "2425-5bhitm", "IT"))
                    .request(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + accessToken)
                    .get();

            int statusCode = response.getStatus();
            if (statusCode != 200) {
                throw new RuntimeException("Failed to fetch users: HTTP status code " + statusCode);
            }

            String jsonResponse = response.readEntity(String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            List<KeycloakUser> users = objectMapper.readValue(jsonResponse, new TypeReference<List<KeycloakUser>>() {});

            for (KeycloakUser user : users) {
                // Process each user
                System.out.println("Processing user: " + user.username());

                // Save or update the user in your database
                persistUser(user);
            }


        } catch (Exception e) {
            // ... (error handling)
        }
    }

    public String getToken() {
        try (Client client = ClientBuilder.newClient()) {
            Form form = new Form();
            form.param("client_id", AUTH_CLIENT_ID);
            form.param("client_secret", AUTH_CLIENT_SECRET);
            form.param("grant_type", "client_credentials");
            form.param("scope", "openid");

            Response tokenResponse = client.target(String.format("%s/protocol/openid-connect/token", AUTH_SERVER_URL))
                    .request(MediaType.APPLICATION_FORM_URLENCODED)
                    .post(Entity.form(form));

            if (tokenResponse.getStatus() != 200) {
                throw new RuntimeException("Failed to obtain token: " + tokenResponse.getStatusInfo().getReasonPhrase());
            }

            JSONParser parser = new JSONParser();
            JSONObject keycloakResponse = new JSONObject();
            try{
                keycloakResponse = (JSONObject) parser.parse(tokenResponse.readEntity(String.class));

            }catch (org.jose4j.json.internal.json_simple.parser.ParseException e) {
                e.printStackTrace();
            }

            System.out.println((String) keycloakResponse.get("access_token"));

            return (String) keycloakResponse.get("access_token");
        } catch (Exception e) {
            System.err.println("Error obtaining token: " + e.getMessage());
            return null;
        }
    }
}

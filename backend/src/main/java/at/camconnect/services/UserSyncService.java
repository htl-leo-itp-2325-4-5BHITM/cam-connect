package at.camconnect.services;

import at.camconnect.dtos.KeycloakUser;
import at.camconnect.model.User;
import at.camconnect.responseSystem.CCException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Startup
@ApplicationScoped
@Transactional
public class UserSyncService {

    @Inject
    AuthService authService;

    @Inject
    EntityManager em;

    @ConfigProperty(name = "quarkus.oidc.base-url")
    String BASE_URL;

/*
    public void onStart(@Observes StartupEvent event) {
        CompletableFuture.runAsync(this::syncUsersWithLDAP);
    }
*/

    public List<KeycloakUser> syncUsersWithLDAP() {
        try (Client client = ClientBuilder.newClient()) {
            String token = authService.getToken();

            Response response = client.target(String.format("%s/admin/realms/%s/users?search=%s&max=1000", BASE_URL, "2425-5bhitm", "IT"))
                    .request(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
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
                persistKeycloakUser(user);
            }

            return users;

        } catch (Exception e) {
            throw new CCException(1207, e.getMessage());
        }
    }

    public void persistKeycloakUser(KeycloakUser user) {
        try{
            em.persist(new User(
                    user.id(),
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
}

package at.camconnect;

import at.camconnect.services.AuthService;
import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.concurrent.CompletableFuture;

@Startup
@ApplicationScoped
public class UserSyncService {

    @Inject
    AuthService authService;

    public void onStart(@Observes StartupEvent event) {
        CompletableFuture.runAsync(() -> syncUsers());
    }

    private void syncUsers() {
        try {
            /*authService.syncUsersWithDatabase(authService.getToken());*/
        } catch (Exception e) {
            // Log the error or handle it appropriately
            System.err.println("Error during user synchronization: " + e.getMessage());
        }
    }

}

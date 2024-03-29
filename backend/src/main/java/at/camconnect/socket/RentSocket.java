package at.camconnect.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@ServerEndpoint("/socket/rents")
@ApplicationScoped
public class RentSocket {

    @Inject
    ObjectMapper objectMapper;

    List<Session> sessions = new ArrayList<>();

    long lastUpdateRequest = 0;

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    int MINIMUM_TIME_BETWEEN_BROADCASTS = 200;

    /**
     * Tells all connected clients that the data has been updated
     * Everytime the method is called it sets the lastUpdateRequest to the current time
     * The actual broadcast is delayed by a 200 milliseconds and then checks if the lastUpdateRequest was 200 mills ago
     * if another update is requested before the first delay runs out, the lastUpdateRequest is now later and therefore
     * the broadcast wont be sent. This new request has triggered a delay of its own which will then be 200 mills later and be accepted
     * The point of this is to prevent multiple broadcasts in a short time without loosing the last one, we dont want one broadcast to happen
     * and the next 5 to be thrown away because they were too close together, the latest call is always the interesting one.
     */
    public void broadcast() {
        lastUpdateRequest = System.currentTimeMillis();

        executor.schedule(() -> {
            if(System.currentTimeMillis() - lastUpdateRequest >= MINIMUM_TIME_BETWEEN_BROADCASTS) {
                sessions.forEach(s -> {
                    s.getAsyncRemote().sendObject("update", result -> {
                        if (result.getException() != null) {
                            System.out.println("Unable to send message: " + result.getException());
                        } else {
                            System.out.println("Updated Socket");
                        }
                    });
                });
            }
        }, MINIMUM_TIME_BETWEEN_BROADCASTS, TimeUnit.MILLISECONDS);
    }
}

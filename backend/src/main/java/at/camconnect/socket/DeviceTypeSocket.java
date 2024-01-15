package at.camconnect.socket;

import at.camconnect.model.DeviceType;
import at.camconnect.model.Rent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ws.rs.Path;

import java.util.ArrayList;
import java.util.List;

@ServerEndpoint("/socket/devicetype")
@ApplicationScoped
public class DeviceTypeSocket {
    List<Session> sessions = new ArrayList<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    public void broadcast(List<DeviceType> response) {
        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject(response, result -> {
               if (result.getException() != null){
                   System.out.println("Unable to send message: " + result.getException());
               }
            });
        });
    }
}

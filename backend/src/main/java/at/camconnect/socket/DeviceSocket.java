package at.camconnect.socket;

import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.util.ArrayList;
import java.util.List;

@ServerEndpoint("/socket/devices")
@ApplicationScoped
public class DeviceSocket {
    List<Session> sessions = new ArrayList<>();

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Socket opened: " + session);
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("Socket closed: " + session);
        sessions.remove(session);
    }

    public void broadcast(List<Device> response) {

        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject("response", result -> {
               if (result.getException() != null){
                   System.out.println("Unable to send message: " + result.getException());
               }
            });
        });
    }
}

package at.camconnect.socket;

import at.camconnect.model.Rent;
import at.camconnect.repository.RentRepository;
import at.camconnect.responseSystem.CCResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ws.rs.Path;

import java.net.Socket;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/socket/rent")
@ApplicationScoped
public class RentSocket {
    List<Session> sessions = new ArrayList<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    public void broadcast(List<Rent> response) {
        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject(response, result -> {
               if (result.getException() != null){
                   System.out.println("Unable to send message: " + result.getException());
               }
            });
        });
    }
}

package at.camconnect.socket;

import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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

    @Inject
    ObjectMapper objectMapper;

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
        String responseString = "";
        try{
            responseString = objectMapper.writeValueAsString(response);
        }catch (JsonProcessingException ex){
            responseString = "ewow";
        }
        String finalResponseString = responseString;
        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject(finalResponseString, result -> {
               if (result.getException() != null){
                   System.out.println("Unable to send message: " + result.getException());
               }
            });
        });
    }
}

package at.camconnect.socket;

import at.camconnect.model.Device;
import at.camconnect.model.DeviceType;
import at.camconnect.repository.DeviceRepository;
import at.camconnect.responseSystem.CCStatus;
import at.camconnect.responseSystem.dtos.CCDataResponseDTO;
import at.camconnect.responseSystem.dtos.CCResponseDetailDTO;
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
public class DeviceSocket { //TODO this should be for deviceTypeFull
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

    //TODO reformat like the RentSocket
    public void broadcast() {
        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject("update", result -> {
               if (result.getException() != null){
                   System.out.println("Unable to send message: " + result.getException());
               }
            });
        });
    }
}

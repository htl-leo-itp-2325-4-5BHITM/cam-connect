package at.camconnect.socket;

import at.camconnect.dtos.RentByStudentDTO;
import at.camconnect.responseSystem.CCStatus;
import at.camconnect.responseSystem.dtos.CCDataResponseDTO;
import at.camconnect.responseSystem.dtos.CCResponseDTO;
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

@ServerEndpoint("/socket/rents")
@ApplicationScoped
public class RentSocket {

    @Inject
    ObjectMapper objectMapper;

    List<Session> sessions = new ArrayList<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    public void broadcast(List<RentByStudentDTO> data) {
        CCDataResponseDTO response = new CCDataResponseDTO(new CCStatus(1000), new CCResponseDetailDTO(data), data);

        //convert to a string (json-string)
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

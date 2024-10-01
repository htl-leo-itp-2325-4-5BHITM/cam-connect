package at.camconnect.dtos;

import java.io.Serializable;

public record LoginRequest(String username, String password) implements Serializable {
}

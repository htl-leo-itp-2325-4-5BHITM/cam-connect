package at.camconnect.dtos;

import jakarta.ws.rs.FormParam;

import java.io.InputStream;

public record FormDataDTO(@FormParam("file")InputStream file, @FormParam("file")String filename) {
}

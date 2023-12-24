package at.camconnect.responseSystem;

import at.camconnect.Utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record CCResponseDetailDTO(String time, String dataType) {
    public CCResponseDetailDTO(Object data) {
        this(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now()), Utils.getTypeOfObjectAsString(data));
    }

    public CCResponseDetailDTO() {
        this(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now()), "none");
    }
}

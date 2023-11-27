package at.camconnect;

import jakarta.ws.rs.core.Response;
import java.util.Map;
import java.util.Objects;

/**
 * Custom CCError that communicates an issue to the API caller
 * Is packaged inside a CCResponseDTO by the CCResponse class
 */
public class CCError {
    private static final Map<Integer, String> ERROR_CODE_DETAILS = Map.ofEntries(
            Map.entry(1000, "All good"),
            Map.entry(1001, "Something went wrong but an invalid error code was provided"),

            Map.entry(1100, "Structure error"),
            Map.entry(1101, "Invalid id in getter"),
            Map.entry(1102, "Invalid id in setter"),
            Map.entry(1103, "Missing required argument in url"),
            Map.entry(1104, "Invalid argument structure/syntax/type in url"),
            Map.entry(1105, "Missing required data in body"),
            Map.entry(1106, "Invalid data structure/syntax/type in body"),

            Map.entry(1200, "Task was not performed"),
            Map.entry(1201, "Duplicate request")
    );

    private int cc_error;
    private String details;
    private String message;

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param cc_error custom cc_error code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCError(int cc_error, String message) {
        setCc_error(cc_error);
        setMessage(message);
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param cc_error custom cc_error code: see api doc for all options
     */
    public CCError(int cc_error) {
        setCc_error(cc_error);
        setMessage("");
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param exception CCException that should get converted to error
     */
    public CCError(CCException exception) {
        setCc_error(exception.getError());
        setMessage(exception.getMessage());
    }

    public Response toResponse(){
        return Response.status(400).entity(this).build();
    }

    //region getter and setter
    public int getCc_error() {
        return cc_error;
    }

    public String getDetails() {
        return details;
    }

    public String getMessage() {
        return message;
    }

    private void setMessage(String message) {
        if(Objects.equals(message, "")) message = "no error message provided";
        this.message = message;
    }

    private void setCc_error(int cc_error){
        if(!ERROR_CODE_DETAILS.containsKey(cc_error)) {
            cc_error = 1001;
        };

        this.cc_error = cc_error;
        this.details = ERROR_CODE_DETAILS.get(cc_error);
    }
    //endregion
}

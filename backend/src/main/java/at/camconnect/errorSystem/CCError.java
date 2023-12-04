package at.camconnect.errorSystem;

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
            Map.entry(1201, "Duplicate request"),
            Map.entry(1202, "No results"),
            Map.entry(1203, "File is empty"),
            Map.entry(1204, "File has Invalid Structure")
    );

    private int errorCode;
    private String details;
    private String message;

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param errorCode custom ccError code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCError(int errorCode, String message) {
        setErrorCode(errorCode);
        setMessage(message);
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param errorCode custom ccError code: see api doc for all options
     */
    public CCError(int errorCode) {
        setErrorCode(errorCode);
        setMessage("");
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param exception CCException that should get converted to error
     */
    public CCError(CCException exception) {
        setErrorCode(exception.getError());
        setMessage(exception.getMessage());
    }

    public Response toResponse(){
        return Response.status(400).entity(this).build();
    }

    //region getter and setter
    public int getErrorCode() {
        return errorCode;
    }

    public String getDetails() {
        return details;
    }

    public String getMessage() {
        return message;
    }

    private void setMessage(String message) {
        if(Objects.equals(message, "") || message == null) message = "";
        this.message = message;
    }

    private void setErrorCode(int errorCode){
        if(!ERROR_CODE_DETAILS.containsKey(errorCode)) {
            errorCode = 1001;
        };

        this.errorCode = errorCode;
        this.details = ERROR_CODE_DETAILS.get(errorCode);
    }
    //endregion
}

package at.camconnect;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * is used to create custom CCError objects meant to be returned by most api endpoints
 */
public class CCError {
    private static final Map<Integer, String> ERROR_CODE_DETAILS;

    //creates a map of all error codes and their details
    //WHEN ADDING AN ERROR CODE: also update the api.md
    static {
        Map<Integer, String> errorCodesMap = new HashMap<>();
        errorCodesMap.put(1000, "All good");
        errorCodesMap.put(1001, "Something went wrong but an invalid error code was provided");

        errorCodesMap.put(1100, "Structure error");
        errorCodesMap.put(1101, "Invalid id in getter");
        errorCodesMap.put(1102, "Invalid id in setter");
        errorCodesMap.put(1103, "Missing required argument in url");
        errorCodesMap.put(1104, "Invalid argument structure/syntax/type in url");
        errorCodesMap.put(1105, "Missing required data in body");
        errorCodesMap.put(1106, "Invalid data structure/syntax/type in body");

        errorCodesMap.put(1200, "Task was not performed");
        errorCodesMap.put(1201, "Duplicate request");

        ERROR_CODE_DETAILS = Collections.unmodifiableMap(errorCodesMap);
    }

    private int cc_error;
    private String details;
    private String message;

    /**
     * creates a new error code meant to be returned by most api endpoints
     *
     * @param errorCode custom cc_error code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCError(int errorCode, String message) {
        setCc_error(errorCode);
        setMessage(message);
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     *
     * @param errorCode custom cc_error code: see api doc for all options
     */
    public CCError(int errorCode) {
        setCc_error(errorCode);
        setMessage("");
    }

    /**
     * creates a new error code meant to be returned by most api endpoints
     *
     * @param exception CCException that should get converted to error
     */
    public CCError(CCException exception) {
        setCc_error(exception.getError());
        setMessage(exception.getMessage());
    }

    public int getCc_error() {
        return cc_error;
    }

    public String getDetails() {
        return details;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        if(Objects.equals(message, "")) message = "no error message provided";
        this.message = message;
    }

    public void setCc_error(int errorCode){
        if(!ERROR_CODE_DETAILS.containsKey(errorCode)) {
            errorCode = 1001;
        };

        this.cc_error = errorCode;
        this.details = ERROR_CODE_DETAILS.get(errorCode);
    }
}

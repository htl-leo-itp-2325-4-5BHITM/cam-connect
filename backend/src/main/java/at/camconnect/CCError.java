package at.camconnect;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * is used to create custom CCError objects meant to be returned by most api endpoints
 */
public class CCError {
    private static final Map<Integer, String> ERROR_CODE_MESSAGES;

    //creates a map of all error codes and their message
    static {
        Map<Integer, String> errorCodesMap = new HashMap<>();
        errorCodesMap.put(1000, "All good");
        errorCodesMap.put(1001, "Something went wrong but an invalid error code was provided");

        errorCodesMap.put(1100, "Structure error");
        errorCodesMap.put(1101, "Invalid id in getter");
        errorCodesMap.put(1102, "Invalid id in setter");
        errorCodesMap.put(1103, "Missing required argument in url");
        errorCodesMap.put(1104, "Invalid argument in url");
        errorCodesMap.put(1105, "Missing required data in body");
        errorCodesMap.put(1106, "Invalid data in body");

        errorCodesMap.put(1200, "Task was not performed");
        errorCodesMap.put(1201, "Duplicate request");

        ERROR_CODE_MESSAGES = Collections.unmodifiableMap(errorCodesMap);
    }

    private int cc_error;
    private String message;

    /**
     * creates a new error code meant to be returned by most api endpoints
     * @param errorCode custom cc_error code: see api doc for all options
     */
    public CCError(int errorCode) {
        if(!ERROR_CODE_MESSAGES.containsKey(errorCode)) {
            errorCode = 1001;
        };

        this.cc_error = errorCode;
        this.message = ERROR_CODE_MESSAGES.get(errorCode);
    }

    public int getCc_error() {
        return cc_error;
    }

    public String getMessage() {
        return message;
    }
}

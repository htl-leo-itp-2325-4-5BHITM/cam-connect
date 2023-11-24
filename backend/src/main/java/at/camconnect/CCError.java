package at.camconnect;

import at.camconnect.dtos.CCErrorDTO;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * is used to create custom CCError objects meant to be returned by most api endpoints
 */
public abstract class CCError {
    private static final Map<Integer, String> ERROR_CODE_MESSAGES;

    /**
     * creates a map of all error codes and their message
     */
    static {
        Map<Integer, String> errorCodesMap = new HashMap<>();
        errorCodesMap.put(1000, "All good");
        errorCodesMap.put(1100, "Structure Error");
        errorCodesMap.put(1101, "Invalid id in getter");
        errorCodesMap.put(1102, "Invalid id in setter");
        errorCodesMap.put(1103, "Missing required data in body");
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
    public static CCErrorDTO create(int errorCode) {
        return new CCErrorDTO(errorCode, ERROR_CODE_MESSAGES.get(errorCode));
    }
}

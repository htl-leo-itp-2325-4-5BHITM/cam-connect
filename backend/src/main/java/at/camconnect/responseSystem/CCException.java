package at.camconnect.responseSystem;

/**
 * Exception that should be thrown anytime a problem should be passed on to the API response
 */
public class CCException extends RuntimeException{
    private int errorCode;

    /**
     * Create new Exception based on a ccError that will be passed to the frontend.
     * @param errorCode custom ccError code: see api doc for all options
     */
    public CCException(int errorCode) {
        super();
        this.errorCode = errorCode;
    }

    /**
     * Create new Exception based on a ccError that will be passed to the frontend.
     * @param errorCode custom ccError code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public int getError() {
        return errorCode;
    }
}

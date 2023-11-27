package at.camconnect.errorSystem;

/**
 * Exception that should be thrown anytime a problem should be passed on to the API response
 */
public class CCException extends RuntimeException{
    private int ccError;

    /**
     * Create new Exception based on a ccError that will be passed to the frontend.
     * @param ccError custom ccError code: see api doc for all options
     */
    public CCException(int ccError) {
        super();
        this.ccError = ccError;
    }

    /**
     * Create new Exception based on a ccError that will be passed to the frontend.
     * @param ccError custom ccError code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCException(int ccError, String message) {
        super(message);
        this.ccError = ccError;
    }

    public int getError() {
        return ccError;
    }
}

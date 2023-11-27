package at.camconnect;

/**
 * Exception that should be thrown anytime a problem should be passed on to the API response
 */
public class CCException extends RuntimeException{
    private int cc_error;

    /**
     * Create new Exception based on a cc_err that will be passed to the frontend.
     * @param cc_error custom cc_error code: see api doc for all options
     */
    public CCException(int cc_error) {
        super();
        this.cc_error = cc_error;
    }

    /**
     * Create new Exception based on a cc_error that will be passed to the frontend.
     * @param cc_error custom cc_error code: see api doc for all options
     * @param message error message that details what caused the error
     */
    public CCException(int cc_error, String message) {
        super(message);
        this.cc_error = cc_error;
    }

    public int getError() {
        return cc_error;
    }
}

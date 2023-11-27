package at.camconnect;

public class CCException extends RuntimeException{
    private int errorCode;
    public CCException(int errorCode) {
        super();
        this.errorCode = errorCode;
    }

    public CCException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public int getError() {
        return errorCode;
    }
}

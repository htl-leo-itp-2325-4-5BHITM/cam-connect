package at.camconnect;

public class CCExpection extends RuntimeException{
    private int error;
    public CCExpection(int errorcode) {
        super();
        this.setError(errorcode);
    }

    public int getError() {
        return error;
    }

    public void setError(int error) {
        this.error = error;
    }
}

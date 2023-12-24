package at.camconnect.responseSystem.exceptionMappers;

import at.camconnect.responseSystem.CCResponse;
import at.camconnect.responseSystem.CCStatus;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

@Provider
public class InvalidFormatExceptionMapper implements ExceptionMapper<InvalidFormatException> {
    @Override
    public Response toResponse(InvalidFormatException exception) {
        return CCResponse.error(new CCStatus(1106, exception.getOriginalMessage()));
    }
}
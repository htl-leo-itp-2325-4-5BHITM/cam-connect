package at.camconnect.responseSystem.exceptionMappers;

import at.camconnect.responseSystem.CCResponse;
import at.camconnect.responseSystem.CCStatus;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {
    @Override
    public Response toResponse(NotFoundException exception) {
        return CCResponse.error(new CCStatus(1107, "This could be a 1103 or 1104 as well. In any case the provided url is not a valid api endpoint."), 404);
    }
}

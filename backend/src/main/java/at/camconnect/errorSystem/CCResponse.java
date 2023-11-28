package at.camconnect.errorSystem;

import jakarta.ws.rs.core.Response;

/**
 * Provides Methods to create Response objects with a DTO of a CCError and optional data as its body
 */
public abstract class CCResponse {
    /**
     * Creates a simple ok response
     * @return Response object with status 200 and ccError 1000
     */
    public static Response ok(){
        return Response.ok().entity(new CCResponseDTO(new CCError(1000, "The endpoint responded without encountering errors"), null)).build();
    }

    /**
     * Creates a simple ok response with data
     * @param data any type of data
     * @return Response object with status 200 and ccError 1000
     */
    public static Response ok(Object data){
        return Response.ok().entity(new CCResponseDTO(new CCError(1000, "The endpoint responded without encountering errors"), data)).build();
    }

    /**
     * Creates error response based on a CCError
     * @param ccError CCError instance that will be passed on to response
     * @return Response object with status 400
     */
    public static Response error(CCError ccError){
        return Response.status(400).entity(new CCResponseDTO(ccError, null)).build();
    }

    /**
     * Creates error response based on an exception
     * @return Response object with status 400
     */
    public static Response error(CCException exception){
        return Response.status(400).entity(new CCResponseDTO(new CCError(exception), null)).build();
    }
}

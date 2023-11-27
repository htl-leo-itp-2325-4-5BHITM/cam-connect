package at.camconnect;

import jakarta.ws.rs.core.Response;

/**
 * Provides Methods to create Response objects with a DTO of a CCError and optional data as its body
 */
public abstract class CCResponse {
    /**
     * Creates a simple ok response
     * @return Response object with status 200 and cc_error 1000
     */
    public static Response ok(){
        return Response.ok().entity(new CCResponseDTO(new CCError(1000), null)).build();
    }

    /**
     * Creates a simple ok response with data
     * @param data any type of data
     * @return Response object with status 200 and cc_error 1000
     */
    public static Response ok(Class data){
        return Response.ok().entity(new CCResponseDTO(new CCError(1000), data)).build();
    }

    /**
     * Creates error response
     * @param cc_error custom cc_error code: see api doc for all options
     * @return Response object with status 400
     */
    public static Response error(int cc_error){
        return Response.status(400).entity(new CCResponseDTO(new CCError(cc_error), null)).build();
    }

    /**
     * Creates error response with data
     * @param cc_error custom cc_error code: see api doc for all options
     * @param data any type of data
     * @return Response object with status 400
     */
    public static Response error(int cc_error, Class data){
        return Response.status(400).entity(new CCResponseDTO(new CCError(cc_error), data)).build();
    }

    /**
     * Creates error response based on an exception
     * @return Response object with status 400
     */
    public static Response error(CCException exception){
        return Response.status(400).entity(new CCResponseDTO(new CCError(exception.getError()), null)).build();
    }
}

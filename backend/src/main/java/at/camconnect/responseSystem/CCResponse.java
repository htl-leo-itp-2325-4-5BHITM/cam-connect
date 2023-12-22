package at.camconnect.responseSystem;

import jakarta.ws.rs.core.Response;

/**
 * Provides Methods to create Response objects with a DTO of a CCStatus and optional data as its body
 */
public abstract class CCResponse {
    /**
     * Creates a simple ok response
     * @return Response object with status 200 and ccStatus 1000
     */
    public static Response ok(){
        return Response.ok().entity(new CCResponseDTO(new CCStatus(1000, "The endpoint responded without encountering errors"),new CCResponseDetailDTO(null), null)).build();
    }

    /**
     * Creates a simple ok response with data
     * @param data any type of data
     * @return Response object with status 200 and ccStatus 1000
     */
    public static Response ok(Object data){
        return Response.ok().entity(new CCResponseDTO(new CCStatus(1000, "The endpoint responded without encountering errors"), new CCResponseDetailDTO(data), data)).build();
    }

    /**
     * Creates error response based on a CCStatus code
     * @param ccStatus CCStatus instance that will be passed on to response
     * @return Response object with status 400
     */
    public static Response error(CCStatus ccStatus){
        return Response.status(400).entity(new CCResponseDTO(ccStatus, new CCResponseDetailDTO(null), null)).build();
    }

    /**
     * Creates error response based on an exception
     * @return Response object with status 400
     */
    public static Response error(CCException exception){
        return Response.status(400).entity(new CCResponseDTO(new CCStatus(exception), new CCResponseDetailDTO(null), null)).build();
    }
}

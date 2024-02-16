package at.camconnect.responseSystem;

import at.camconnect.responseSystem.dtos.CCDataResponseDTO;
import at.camconnect.responseSystem.dtos.CCResponseDTO;
import at.camconnect.responseSystem.dtos.CCResponseDetailDTO;
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
        return Response.ok().entity(new CCResponseDTO(new CCStatus(1000, "The endpoint responded without encountering errors"), new CCResponseDetailDTO())).build();
    }

    /**
     * Creates a simple ok response with data
     * @param data any type of data
     * @return Response object with status 200 and ccStatus 1000
     */
    public static Response ok(Object data){
        return Response.ok().entity(new CCDataResponseDTO(new CCStatus(1000, "The endpoint responded without encountering errors"), new CCResponseDetailDTO(data), data)).build();
    }

    /**
     * Creates error response based on a CCStatus code
     * @param ccStatus CCStatus instance that will be passed on to response
     * @return Response object with status 400
     */
    public static Response error(CCStatus ccStatus){
        return Response.status(400).entity(new CCResponseDTO(ccStatus, new CCResponseDetailDTO())).build();
    }

    /**
     * Creates error response based on a CCStatus code
     * @param ccStatus CCStatus instance that will be passed on to response
     * @param httpStatus http status code that will be used in the response
     * @return Response object with status 400
     */
    public static Response error(CCStatus ccStatus, int httpStatus){
        return Response.status(httpStatus).entity(new CCResponseDTO(ccStatus, new CCResponseDetailDTO())).build();
    }

    /**
     * Creates error response based on an exception
     * @param exception the CCException that should be transformed into an error
     * @return Response object with status 400
     */
    public static Response error(CCException exception){
        return Response.status(400).entity(new CCResponseDTO(new CCStatus(exception), new CCResponseDetailDTO())).build();
    }

    /**
     * Creates error response based on an exception
     * @param exception the CCException that should be transformed into an error
     * @param httpStatus http status code that will be used in the response
     * @return Response object with status 400
     */
    public static Response error(CCException exception, int httpStatus){
        return Response.status(httpStatus).entity(new CCResponseDTO(new CCStatus(exception), new CCResponseDetailDTO())).build();
    }
}

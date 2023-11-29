package at.camconnect.errorSystem;

/**
 * used to transfer both CCError and any data both at once
 * @param ccError custom cc error: check api doc
 * @param data any type of data
 */
public record CCResponseDTO(CCError ccError, Object data) {
}

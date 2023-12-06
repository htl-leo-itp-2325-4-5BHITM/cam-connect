package at.camconnect.statusSystem;

/**
 * used to transfer both CCStatus and any data both at once
 * @param ccStatus custom cc status: check api doc for options
 * @param data any type of data
 */
public record CCResponseDTO(CCStatus ccStatus, Object data) {
}

package at.camconnect.responseSystem;

/**
 * used to transfer a request status and any data at once
 * @param ccStatus custom cc status: check api doc for options
 * @param details CCResponseDetail's like time and type of data
 */
public record CCResponseDTO(CCStatus ccStatus, CCResponseDetailDTO details) {
}
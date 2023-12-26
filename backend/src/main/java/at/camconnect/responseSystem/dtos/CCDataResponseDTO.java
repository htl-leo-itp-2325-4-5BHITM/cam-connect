package at.camconnect.responseSystem.dtos;

import at.camconnect.responseSystem.CCStatus;

/**
 * used to transfer a request status, response details and any data at once
 * @param ccStatus custom cc status: check api doc for options
 * @param details CCResponseDetail's like time and type of data
 * @param data any type of data
 */
public record CCDataResponseDTO(CCStatus ccStatus, CCResponseDetailDTO details, Object data) {

}
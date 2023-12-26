package at.camconnect.responseSystem.dtos;

import at.camconnect.responseSystem.CCStatus;

/**
 * used to transfer a request status and any data at once
 * @param ccStatus custom cc status: check api doc for options
 * @param details CCResponseDetail's like time and type of data
 */
public record CCResponseDTO(CCStatus ccStatus, CCResponseDetailDTO details) {
}
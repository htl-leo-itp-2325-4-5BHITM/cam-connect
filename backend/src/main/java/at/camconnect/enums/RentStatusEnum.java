package at.camconnect.enums;

public enum RentStatusEnum {
    //TODO remove "created" once oldWeb is abandoned: new ui creates rents via popup and its either not existent or waiting
    CREATED, WAITING, CONFIRMED, DECLINED, RETURNED, DELETED
}

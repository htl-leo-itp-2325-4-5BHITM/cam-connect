import {model} from "../index"
import {apiQuery} from "../base"
import {DeviceType} from "./deviceType.service"
import {io, Socket} from "socket.io-client"

const socket: Socket = io();

export interface Device{
    serial: string
    number: string
    note: string
    type: DeviceType
}

export interface DeviceDTO{
    serial: string
    number: string
    note: string
    type_id: number
}

export default class DeviceService{
    static fetchAll(){
        socket.on("noArg", (data: Device[]) => {
            model.setDevices(data)
        });
    }
}
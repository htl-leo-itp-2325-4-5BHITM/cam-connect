import {model} from "../index"
import {apiQuery, config} from "../base"
import {DeviceType} from "./deviceType.service"

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
        let socket = new WebSocket("ws://localhost:8080/api/socket/devices");

        socket.onopen = function() {
            console.log("connected")
        }
        socket.onmessage = function(m) {
            model.setDevices(JSON.parse(m.data))
        }
    }
}
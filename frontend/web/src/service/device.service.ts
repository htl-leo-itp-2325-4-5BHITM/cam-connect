import {model} from "../index"
import {apiQuery, config} from "../base"
import {DeviceType} from "./deviceType.service"

var connected = false;
var socket;

connect()
function connect() {
    if (! connected) {
        socket = new WebSocket("ws://localhost:8080/api/socket/devices");

        socket.onopen = function() {
            connected = true;
            console.log("connected")
        };
        socket.onmessage = function(m) {
            console.log("Got message: " + m.data);
        };
    }
}

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
    }
}
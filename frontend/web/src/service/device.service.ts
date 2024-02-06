import {model} from "../index"
import {config, api} from "../base"
import {DeviceType, DeviceTypeVariantCollection} from "./deviceType.service"

export interface Device{
    device_id: number
    serial: string
    number: string
    note: string
    type: DeviceType
}

export interface DeviceDTO{
    device_id: number
    serial: string
    number: string
    note: string
    type_id: number
}

export default class DeviceService{
    static fetchAll(){

        api.fetchData<Device[]>("/device/getall")
            .then(data => {
                model.loadDevices(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static createSocketConnection(){
        let socket = new WebSocket(config.socket_url + "/socket/devices");

        socket.onopen = function() {
            console.log("connected")
        }
        socket.onmessage = function(m) {
            model.loadDevices(JSON.parse(m.data))
        }
    }

    static update(device: Device){
        api.updateData<Device>("/device", device.device_id, device)
            .then(data => {
                console.log("updated", data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
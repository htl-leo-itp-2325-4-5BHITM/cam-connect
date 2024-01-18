import {model} from "../index"
import {apiQuery} from "../base"
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

    }
}
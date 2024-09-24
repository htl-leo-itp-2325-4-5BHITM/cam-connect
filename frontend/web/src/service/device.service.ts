import {model} from "../index"
import {ccResponse, SimpleOption} from "../base"
import {DeviceType, DeviceTypeSource, DeviceTypeVariantCollection, DeviceTypeVariantEnum} from "./deviceType.service"
import {Rent, RentByStudentDTO} from "./rent.service"
import {Api} from "../util/Api"

export enum DeviceStatus{
    ACTIVE="active", DELETED="deleted", UNAVAILABLE="unavailable"
}

export interface Device{
    device_id: number
    serial: string
    number: string
    note: string
    type: DeviceType
    creation_date: string
    change_date: string
    status: DeviceStatus
}

export interface DeviceDTO{
    device_id: number
    serial: string
    number: string
    note?: string
    type_id: number
    creation_date: string
    change_date: string
    status: DeviceStatus
}

export interface SearchDTO{
    searchTerm: string
    typeId: number
    onlyAvailable: boolean
}

export default class DeviceService{
    static fetchAll(){
        Api.fetchData<Device[]>("/device/getall")
            .then(result => {
                model.loadDevices(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

/*    static createSocketConnection(){
        let socket = new WebSocket(config.socket_url + "/socket/devices");

        socket.onmessage = (m) => {
            let result = JSON.parse(m.data) as ccResponse<Device[]>
            model.loadDevices(result.data)
        }
    }*/

    static create(device: Device) {
        Api.postData("/device/create", device)
            .then(result => {
                console.log("created", result)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static update(device: Device){
        Api.postData(`/device/getbyid/${device.device_id}/update`, device)
            .then(data => {
                console.log("updated", data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(device: Device) {
        Api.fetchData(`/device/getbyid/${device.device_id}/remove`)
            .then(() => {
                DeviceService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static async search(searchDTO: SearchDTO): Promise<SimpleOption<number, Device>[]> {
        try {
            const result: ccResponse<SimpleOption<number, Device>[]> = await Api.postData<unknown, Device>(
                `/device/search`,
                searchDTO
            )
            return result.data || []
        } catch (e) {
            console.error(e)
            return []
        }
    }
}
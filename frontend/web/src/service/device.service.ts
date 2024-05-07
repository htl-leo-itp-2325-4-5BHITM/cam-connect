import {model} from "../index"
import {config, Api, ccResponse} from "../base"
import {DeviceType, DeviceTypeSource, DeviceTypeVariantCollection, DeviceTypeVariantEnum} from "./deviceType.service"
import {Rent, RentByStudentDTO} from "./rent.service"
import {AutocompleteOption} from "../components/basic/autocomplete.component"

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
    note?: string
    type_id: number
}

export interface SearchDTO{
    searchTerm: string
    typeId: number
    onlyAvailable: boolean
}

export default class DeviceService{
    static fetchAll(){
        Api.fetchData<Device[]>("/device/getall")
            .then(data => {
                model.loadDevices(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static createSocketConnection(){
        let socket = new WebSocket(config.socket_url + "/socket/devices");

        socket.onmessage = (m) => {
            let result = JSON.parse(m.data) as ccResponse<Device[]>
            model.loadDevices(result.data)
        }
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

    static async search(searchDTO: SearchDTO): Promise<AutocompleteOption<Device>[]> {
        try {
            const result: ccResponse<AutocompleteOption<Device>[]> = await Api.postData<unknown, Device>(
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
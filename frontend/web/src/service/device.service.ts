import {model} from "../index"
import {ccResponse, config, SimpleOption} from "../base"
import {DeviceType, DeviceTypeSource, DeviceTypeVariantCollection, DeviceTypeVariantEnum} from "./deviceType.service"
import {Rent, RentByStudentDTO} from "./rent.service"
import {Api} from "../util/Api"

export enum DeviceStatus{
    ACTIVE="ACTIVE", DELETED="DELETED", UNAVAILABLE="UNAVAILABLE"
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
        Api.getData<Device[]>("/device/getall")
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

    static create(device: Device): Promise<void> {
        return Api.postData("/device/create", {
            serial: device.serial,
            number: device.number,
            note: device.note,
            type_id: device.type.type_id,
            status: device.status
        })
            .then(result => {
                if (result.ccStatus.statusCode == 1000) {
                    console.log("created", result);
                    DeviceService.fetchAll();
                } else {
                    return Promise.reject("Serial number has to be unique");
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    static update(device: Device){
        Api.postData(`/device/getbyid/${device.device_id}/update`, {
            device_id: device.device_id,
            serial: device.serial,
            number: device.number,
            note: device.note,
            type_id: device.type.type_id,
            status: device.status
        })
            .then(data => {
                console.log("updated", data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(device: Device) {
        Api.getData(`/device/getbyid/${device.device_id}/remove`)
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

    static importDevices(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        fetch(config.api_url + "/device/importcsv", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${model.appState.value.access_token}`
            },
            body: formData,
        }).then((response) => {
            if (response.status === 200) {
                DeviceService.fetchAll();
            }
        })
    }

    static exportDevices() {
        fetch(config.api_url + "/device/exportcsv", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${model.appState.value.access_token}`
            }
        }).then((response) => {
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'export_device.csv';
                a.click();
            });
        })
    }
}
import {DeviceStatus} from "./device.service"
import {Api} from "../util/Api"
import {model} from "../index"
import {DeviceType} from "./deviceType.service"

export interface DeviceSetCreateDTO{
    id: number,
    name: string,
    description: string,
    deviceTypeIds: number[],
    status: DeviceStatus
}

export interface DeviceSet {
    id: number,
    name: string,
    description: string,
    device_types: DeviceType[],
    status: DeviceStatus
}

export default class DeviceSetService{
    static fetchAll(){
        Api.fetchData<DeviceSet[]>("/deviceset/getall")
            .then(result => {
                model.loadDeviceSets(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(device: DeviceSet) {
        Api.putData("/deviceset/delete?id=" + device.id)
            .then(result => {
                if (result.ccStatus.statusCode == 1000) {
                    DeviceSetService.fetchAll();
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    static create(element: DeviceSetCreateDTO) {
        return Api.postData("/deviceset/create", element)
            .then(result => {
                if (result.ccStatus.statusCode == 1000) {
                    DeviceSetService.fetchAll();
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    static update(element: DeviceSetCreateDTO) {
        Api.putData("/deviceset/update", element)
            .then(result => {
                if (result.ccStatus.statusCode == 1000) {
                    DeviceSetService.fetchAll();
                }
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    static getDeviceSetById(id: number) {
        return Api.fetchData<DeviceSet>("/deviceset/getbyid?id=" + id)
            .then(result => {
                return result.data;
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            });
    }
}
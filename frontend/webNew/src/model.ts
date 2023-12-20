import {DeviceTypeCollection, getAllDeviceTypes} from "./service/devicetype-service"
import { Observable } from 'rxjs';

/**
 * basically a representation of all entities in the backend
 */
interface RequestModel {
    deviceTypes: DeviceTypeCollection
}

export default class Model implements RequestModel {
    observer: Observable<Model>

    deviceTypes: DeviceTypeCollection = []

    constructor() {
        getAllDeviceTypes().subscribe(deviceTypes => {this.deviceTypes = deviceTypes})
        /*this.observer = new Observable((subscriber) => {

        });*/
    }
}
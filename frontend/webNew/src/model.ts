import {allDeviceTypes, DeviceTypeCollection} from "./service/devicetype-service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

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
        this.observer = new Observable((subscriber) => {
            allDeviceTypes.subscribe(deviceTypes => {this.deviceTypes = deviceTypes; subscriber.next(this)})
        });
    }
}

export class AsyncController<T> implements ReactiveController {
    sub: Subscription | null = null;
    value: T

    constructor(private host: ReactiveControllerHost, private source: Observable<any>, private converterFunc?: (a: any) => T) {
        this.host.addController(this);
    }

    hostConnected() {
        this.sub = this.source.subscribe(value => {
            if(this.converterFunc){
                this.value = this.converterFunc(value)
            }
            else{
                this.value = value;
            }
            this.host.requestUpdate()
        })
    }

    hostDisconnected() {
        this.sub?.unsubscribe();
    }
}
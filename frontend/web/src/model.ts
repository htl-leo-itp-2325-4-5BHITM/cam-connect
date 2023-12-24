import DevicetypeService, {DeviceTypeCollection} from "./service/devicetype-service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {Observable, Subject, Subscription} from 'rxjs';
import {deviceTypeToFilterOption} from "./util"
import {FilterOption, FilterOptionType} from "./components/basic/filter-container-component"


interface RequestModel {
    deviceTypes: Subject<DeviceTypeCollection>
}

export default class Model implements RequestModel{
    deviceTypes = new Subject<DeviceTypeCollection>()

    constructor() {
        DevicetypeService.fetchAll()
    }

    setDeviceTypes(deviceTypes: DeviceTypeCollection){
        this.deviceTypes.next(deviceTypes)
    }
}

export class ObservedProperty<T> implements ReactiveController {
    sub: Subscription | null = null;

    constructor(private host: ReactiveControllerHost, private source: Observable<T>, public value?: T) {
        this.host.addController(this);
    }

    hostConnected() {
        this.sub = this.source.subscribe(value => {
            this.value = value;
            this.host.requestUpdate()
        })
    }

    hostDisconnected() {
        this.sub?.unsubscribe();
    }
}
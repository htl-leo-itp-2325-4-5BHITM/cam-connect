import DeviceTypeService, {DeviceTypeCollection} from "./service/deviceType-service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {Observable, Subject, Subscription} from 'rxjs';
import DeviceTypeAttributeService, {
    DeviceTypeAttribute,
    DeviceTypeAttributeCollection
} from "./service/deviceTypeAttribute-service"
import {FilterOption} from "./components/basic/filter-block-component"
import Util from "./util"


export default class Model{
    readonly deviceTypes = new Subject<DeviceTypeCollection>()
    readonly deviceTypeAttributes = new Subject<DeviceTypeAttributeCollection>()
    readonly deviceTypeAttributesAsFilterOptions = {
        cameraResolutions: new Subject<FilterOption[]>(),
        cameraSensors: new Subject<FilterOption[]>(),
        cameraSystems: new Subject<FilterOption[]>(),
        lensMounts: new Subject<FilterOption[]>(),
        tripodHeads: new Subject<FilterOption[]>()
    }

    constructor() {
        DeviceTypeService.fetchAll()
        DeviceTypeAttributeService.fetchAll()
    }

    setDeviceTypes(deviceTypes: DeviceTypeCollection){
        this.deviceTypes.next(deviceTypes)
    }

    setDeviceTypeAttributes(deviceTypeAttributes: DeviceTypeAttributeCollection){
        this.deviceTypeAttributes.next(deviceTypeAttributes)

        this.deviceTypeAttributesAsFilterOptions.cameraResolutions
            .next(deviceTypeAttributes.cameraResolutions
            .map(Util.deviceTypeAttributeToFilterOption))
        this.deviceTypeAttributesAsFilterOptions.cameraSensors
            .next(deviceTypeAttributes.cameraSensors
            .map(Util.deviceTypeAttributeToFilterOption))
        this.deviceTypeAttributesAsFilterOptions.cameraSystems
            .next(deviceTypeAttributes.cameraSystems
            .map(Util.deviceTypeAttributeToFilterOption))
        this.deviceTypeAttributesAsFilterOptions.lensMounts
            .next(deviceTypeAttributes.lensMounts
            .map(Util.deviceTypeAttributeToFilterOption))
        this.deviceTypeAttributesAsFilterOptions.tripodHeads
            .next(deviceTypeAttributes.tripodHeads
            .map(Util.deviceTypeAttributeToFilterOption))
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
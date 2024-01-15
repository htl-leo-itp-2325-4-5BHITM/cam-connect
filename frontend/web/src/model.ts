import DeviceTypeService, {DeviceTypeCollection} from "./service/deviceType.service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {map, Observable, Subject, Subscription} from 'rxjs';
import DeviceTypeAttributeService, { DeviceTypeAttributeCollection } from "./service/deviceTypeAttribute.service"
import Util from "./util"
import DeviceService, {Device} from "./service/device.service"

/**
 * An instance of this class is our singular data provider. It interfaces between the individual service classes which
 * do the actual api calling, and the components or other usages in the index file that display the data.
 * For each dataset it provides the following:
 *  - a readonly variable that is a RXJS Subject. This Subject can be accessed by using Model.subjectName.subscribe()
 *    this means that every time the data in the Subject updates all the variables that have subscribed to the subject
 *    also update.
 *  - a setter function that sets the data in the RXJS Subject and sends an update to all subscribers.
 */
export default class Model{
    readonly devices = new Subject<Device[]>()
    readonly deviceTypes = new Subject<DeviceTypeCollection>()
    readonly deviceTypeAttributes = new Subject<DeviceTypeAttributeCollection>()
    /**
     * This is a representation of all the deviceTypeAttributes split up and transformed into FilterOptions that can be
     * used by the filter-block-component.
     * What does this code mean:
     * - Each attribute Subject is essentially a copy of the deviceTypeAttributes Subject (what the pipe function does)
     * - When the value in the deviceTypeAttributes changes (the .next() function is called) each of these Subject is also
     *   updated (this is what the first map function does: It maps every value of the original to this one.)
     * - Instead of just returning value we use a default js function .map that basically iterates over an array and executes
     *   a function for each value (in this case the Util.deviceTypeAttributeToFilterOption).
     */
    readonly deviceTypeAttributesAsFilterOptions = {
        cameraResolutions: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.cameraResolutions.map(Util.deviceTypeAttributeToFilterOption))
        ),
        cameraSensors: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.cameraSensors.map(Util.deviceTypeAttributeToFilterOption))
        ),
        cameraSystems: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.cameraSystems.map(Util.deviceTypeAttributeToFilterOption))
        ),
        lensMounts: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.lensMounts.map(Util.deviceTypeAttributeToFilterOption))
        ),
        tripodHeads: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.tripodHeads.map(Util.deviceTypeAttributeToFilterOption))
        )
    }

    /**
     * When its created, a new instance gathers all the data from the API endpoints
     */
    constructor() {
        DeviceService.fetchAll()
        DeviceTypeService.fetchAll()
        DeviceTypeAttributeService.fetchAll()
    }

    //region setter functions: used by the service classes to set the data in the model to whatever the api returned
    setDevices(devices: Device[]){
        this.devices.next(devices)
    }
    setDeviceTypes(deviceTypes: DeviceTypeCollection){
        this.deviceTypes.next(deviceTypes)
    }

    setDeviceTypeAttributes(deviceTypeAttributes: DeviceTypeAttributeCollection){
        this.deviceTypeAttributes.next(deviceTypeAttributes)
    }

    //endregion
}

/**
 * A wrapper class for subscribing to a RXJS subject.
 * This is used by the components in order to easily pass data from the API to the component.
 */
export class ObservedProperty<T> implements ReactiveController {
    sub: Subscription | null = null;

    //registers a controller (a instance of this class) on the host (a component)
    constructor(private host: ReactiveControllerHost, private source: Observable<T>, public value?: T) {
        this.host.addController(this);
    }

    //subscribes to the provided Observable RXJS subject and stores the value in its own value property
    //requests the host(a component instance) to update (re-render with the new data)
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
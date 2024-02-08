import DeviceTypeService, {DeviceTypeVariantCollection} from "./service/deviceType.service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {BehaviorSubject, lastValueFrom, map, Observable, Subject, Subscription} from 'rxjs';
import DeviceTypeAttributeService, { DeviceTypeAttributeCollection } from "./service/deviceTypeAttribute.service"
import Util from "./util"
import DeviceService, {Device} from "./service/device.service"
import RentService, {Rent, RentByStudentDTO} from "./service/rent.service"
import {FilterOption} from "./components/basic/filterContainer.component"
import {Teacher} from "./service/teacher.service";
import {Student} from "./service/student.service";

export enum PageEnum { EQUIPMENT="equipment", RENTS="rents", CALENDAR="calendar" }

export interface AppState {
    page: PageEnum,
    createRentModalOpen: boolean
}

type AppStatePartial = Partial<AppState>

/**
 * An instance of this class is our singular data provider. It interfaces between the individual service classes which
 * do the actual api calling, and the components or other usages in the index file that display the data.
 * For each dataset it provides the following:
 *  - a readonly variable that is a RXJS Subject. This Subject can be accessed by using Model.subjectName.subscribe()
 *    this means that every time the data in the Subject updates all the variables that have subscribed to the subject
 *    also update.
 *  - a load function that sets the data in the RXJS Subject and sends an update to all subscribers.
 */
export default class Model{
    readonly rents = new BehaviorSubject(<RentByStudentDTO[]>([]))

    readonly teachers = new BehaviorSubject(<Teacher[]>([]))

    readonly students = new BehaviorSubject(<Student[]>([]))

    readonly devices = new BehaviorSubject<Device[]>([])
    readonly deviceTypes = new BehaviorSubject<DeviceTypeVariantCollection>({audioTypes: [], cameraTypes: [], droneTypes: [], lensTypes: [], lightTypes: [], stabilizerTypes: [], tripodHeads: []})
    readonly deviceTypeAttributes = new BehaviorSubject<DeviceTypeAttributeCollection>({cameraResolutions: [], cameraSensors: [], cameraSystems: [], lensMounts: [], tripodHeads: []})
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

    readonly appState = new BehaviorSubject<AppState>({
        page: PageEnum.EQUIPMENT,
        createRentModalOpen: false
    })


    //TODO details
    readonly deviceTypeNameFilterOptions = new BehaviorSubject<FilterOption[]>([
        {name: "Kamera", id: "camera", details: "Kamera halt"},
        {name: "Drone", id: "drone", details: "Drone halt"},
        {name: "Objektiv", id: "lens", details: "Objektiv halt"},
        {name: "Licht", id: "light", details: "Objektiv halt"},
        {name: "Mikrofon", id: "microphone", details: "Mikro halt"},
        {name: "Stabilisator", id: "stabilizer", details: "Stablisationsysteme"},
        {name: "Stativ", id: "tripod", details: "dings"},
    ])

    /**
     * When its created, a new instance gathers all the data from the API endpoints
     */
    constructor() {
        this.queryData()
    }

    queryData(){
        RentService.fetchAll()
        DeviceService.fetchAll()
        DeviceTypeService.fetchAll()
        DeviceTypeAttributeService.fetchAll()
    }

    loadRents(rent: RentByStudentDTO[]){
        this.rents.next(rent)
    }

    loadTeachers(teacher: Teacher[]){
        this.teachers.next(teacher)
    }

    loadStudents(student: Student[]){
        this.students.next(student)
    }

    //region load functions: used by the service classes to set the data in the model to whatever the api returned
    loadDevices(devices: Device[]){
        this.devices.next(devices)
    }
    loadDeviceTypes(deviceTypes: DeviceTypeVariantCollection){
        this.deviceTypes.next(deviceTypes)
    }

    loadDeviceTypeAttributes(deviceTypeAttributes: DeviceTypeAttributeCollection){
        this.deviceTypeAttributes.next(deviceTypeAttributes)
    }

    //endregion

    //region update functions

    updateAppState(data: AppStatePartial){
        this.appState.next(Object.assign({}, this.appState.value, data))
    }

    //sry i cant really test this rn it might throw ewows :3
    async updateDevice(device: Device){
        DeviceService.update(device)

        let devices = await lastValueFrom(this.devices)
        let updatedDevices = Util.replaceItemByIdInJsonArray<Device>(devices, device, device.device_id, "device_id")
        this.devices.next(updatedDevices)
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
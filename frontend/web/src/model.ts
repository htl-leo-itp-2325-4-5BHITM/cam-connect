import DeviceTypeService, {
    DeviceTypeFullDTO,
    DeviceTypeVariantCollection
} from "./service/deviceType.service"
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {BehaviorSubject, lastValueFrom, map, Observable, Subject, Subscription} from 'rxjs';
import DeviceTypeAttributeService, { DeviceTypeAttributeCollection } from "./service/deviceTypeAttribute.service"
import Util from "./util/Util"
import DeviceService, {Device} from "./service/device.service"
import RentService, {Rent, RentByStudentDTO} from "./service/rent.service"
import {FilterOption} from "./components/basic/filterContainer.component"
import {AppState} from "./AppState"
import TagService, {Tag} from "./service/tag.service"
import UserService, {Student, Teacher } from "./service/user.service";
import AuthService from "./service/auth.service"
import DeviceSetService, {DeviceSet, DeviceSetFullDTO} from "./service/deviceSet.service"
import {MergedEquipment} from "./components/app/deviceList.component"

export enum PageEnum { EQUIPMENT="equipment", RENTS="rents"}
export enum EditPageEnum { OVERVIEW="overview", CHILDREN="children", DEVICE="device", DEVICETYPE="devicetype", DEVICESET="deviceset" }

/**
 * A message to all future students working on this project: we were forced to use no proper library like react or
 * a framework like angular by a-burger. Therefore we had to write SO MANY SYSTEMS ourselfs that would have been included
 * in a framework. As well as this abomination.. sorry guys
 */

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
    readonly appState = new BehaviorSubject(new AppState())
    readonly rents = new BehaviorSubject(<RentByStudentDTO[]>([]))
    readonly teachers = new BehaviorSubject(<Teacher[]>([]))
    readonly students = new BehaviorSubject(<Student[]>([]))
    readonly tags = new BehaviorSubject(<Tag[]>([]))
    readonly devices = new BehaviorSubject<Device[]>([])
    readonly deviceTypes = new BehaviorSubject<DeviceTypeVariantCollection>({audioTypes: [], microphoneTypes: [], cameraTypes: [], droneTypes: [], lensTypes: [], lightTypes: [], stabilizerTypes: [], tripodHeads: []})
    readonly deviceTypesFull = new BehaviorSubject<DeviceTypeFullDTO[]>([])
    readonly deviceTypeAttributes = new BehaviorSubject<DeviceTypeAttributeCollection>({cameraResolutions: [], cameraSystems: [], lensMounts: [], tripodHeads: [], audioConnectors: []})
    readonly deviceSets = new BehaviorSubject<DeviceSet[]>([])
    readonly deviceSetsFull = new BehaviorSubject<DeviceSetFullDTO[]>([])

    /**
     * This is a representation of all the deviceTypeAttributes split up and transformed into FilterOptions that can be
     * used by the filter-block-component.
     * What does this code mean:
     * - Each attribute Subject is essentially a copy of the deviceTypeAttributes Subject (what the pipe function does)
     * - When the value in the deviceTypeAttributes changes (the .next() function is called) each of these Subject is also
     *   updated (this is what the first map function does: It maps every value of the original to this one.)
     * - Instead of just returning value we use a default js function .map that basically iterates over an array and executes
     *   a function for each value (in this case the util.deviceTypeAttributeToFilterOption).
     */
    readonly deviceTypeAttributesAsFilterOptions = {
        cameraResolutions: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.cameraResolutions.map(Util.deviceTypeAttributeToFilterOption))
        ),
        cameraSystems: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.cameraSystems.map(Util.deviceTypeAttributeToFilterOption))
        ),
        lensMounts: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.lensMounts.map(Util.deviceTypeAttributeToFilterOption))
        ),
        tripodHeads: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.tripodHeads.map(Util.deviceTypeAttributeToFilterOption))
        ),
        audioConnectors: this.deviceTypeAttributes.pipe(
            map(deviceTypeAttributes => deviceTypeAttributes.audioConnectors.map(Util.deviceTypeAttributeToFilterOption))
        )
    }

    //TODO details
    readonly deviceTypeNameFilterOptions = new BehaviorSubject<FilterOption[]>([
        {name: "Kamera", id: "camera", details: "Kamera halt"},
        {name: "Drone", id: "drone", details: "Drone halt"},
        {name: "Objektiv", id: "lens", details: "Objektiv halt"},
        {name: "Licht", id: "light", details: "Objektiv halt"},
        {name: "Audio", id: "audio", details: "Audio halt"},
        {name: "Mikrofon", id: "microphone", details: "Mikro halt"},
        {name: "Stabilisator", id: "stabilizer", details: "Stablisationsysteme"},
        {name: "Stativ", id: "tripod", details: "dings"},
        {name: "Simpel", id: "simple", details: "dings"}
    ] as const)

    readonly tagFilterOptions = this.tags.pipe(
        map(tags => tags.map(tag => ({name: tag.name, details: tag.description, id: tag.tag_id} as FilterOption)))
    )

    createSocketConnection(){
        console.log("creating socket connection")
        RentService.createSocketConnection()
    }

    fetchAll(){
        console.log("fetching all data")

        RentService.fetchAll()
        DeviceService.fetchAll()
        DeviceSetService.fetchAll();
        DeviceSetService.fetchAllFull()
        DeviceTypeService.fetchAll()
        DeviceTypeService.fetchAllFull()
        DeviceTypeAttributeService.fetchAll()
        TagService.fetchAll()
        UserService.fetchAll()
    }

    //region load functions: used by the service classes to set the data in the model to whatever the api returned
    loadRents(rent: RentByStudentDTO[] = []){
        this.rents.next(rent)
    }

    loadTeachers(teacher: Teacher[] = []){
        this.teachers.next(teacher)
    }

    loadStudents(student: Student[] = []){
        this.students.next(student)
    }

    loadTags(tag: Tag[] = []){
        this.tags.next(tag)
    }

    loadDevices(devices: Device[] = []){
        this.devices.next(devices)
    }
    loadDeviceTypes(deviceTypes: DeviceTypeVariantCollection = {audioTypes: [], microphoneTypes: [], cameraTypes: [], droneTypes: [], lensTypes: [], lightTypes: [], stabilizerTypes: [], tripodHeads: []}){
        this.deviceTypes.next(deviceTypes)
    }
    loadDeviceTypesFull(deviceTypesFull: DeviceTypeFullDTO[]){
        this.deviceTypesFull.next(deviceTypesFull)
    }

    loadDeviceTypeAttributes(deviceTypeAttributes: DeviceTypeAttributeCollection = {cameraResolutions: [], cameraSystems: [], lensMounts: [], tripodHeads: [], audioConnectors: []}){
        this.deviceTypeAttributes.next(deviceTypeAttributes)
    }

    loadDeviceSets(deviceSets: DeviceSet[]){
        this.deviceSets.next(deviceSets)
    }

    loadDeviceSetsFull(deviceSetsFull: DeviceSetFullDTO[]){
        this.deviceSetsFull.next(deviceSetsFull)
    }

    //endregion

    //region update functions

    updateAppState(appState: AppState){
        this.appState.next(appState)
    }

    //endregion
}

/**
 * A wrapper class for subscribing to a RXJS subject.
 * This is used by the components in order to easily pass data from the API to the component.
 */
export class ObservedProperty<T> implements ReactiveController {
    private sub: Subscription | null = null
    public value: T

    //registers a controller (a instance of this class) on the host (a component)
    constructor(private host: ReactiveControllerHost, private source: Observable<T>, value?: T) {
        this.value = value
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
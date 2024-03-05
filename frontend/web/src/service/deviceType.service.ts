import {Api} from '../base'
import {model} from "../index"
import {CameraResolution, CameraSensor, CameraSystem, LensMount, TripodHead} from "./deviceTypeAttribute.service"

//region devicetype interfaces
export interface DeviceTypeSource {
    type_id: number
    variant: DeviceTypeVariantEnum
    name: string
    image: string
}

export enum DeviceTypeVariantEnum {
    microphone="microphone", camera="camera", drone="drone", lens="lens", light="light", stabilizer="stabilizer", tripod="tripod", simple="simple"
}

export interface MicrophoneType extends DeviceTypeSource{
    windblocker: boolean
    wireless: boolean
    needsRecorder: boolean
}

export interface MicrophoneTypeDTO extends MicrophoneType{}

export interface CameraType extends DeviceTypeSource{
    sensor: CameraSensor
    resolution: CameraResolution
    mount: LensMount
    system: CameraSystem
    autofocus: boolean
    framerate: number
}
export interface CameraTypeDTO extends DeviceTypeSource{
    sensor_id: number
    resolution_id: number
    mount_id: number
}

export interface DroneType extends DeviceTypeSource{
    sensor: CameraSensor
    resolution: CameraResolution
    max_range: number
}

export interface DroneTypeDTO extends DeviceTypeSource{
    sensor_id: number
    resolution_id: number
    max_range: number
}

export interface LensType extends DeviceTypeSource{
    f_stop: number
    focal_length: number
    lens_mount: LensMount
}

export interface LensTypeDTO extends DeviceTypeSource{
    f_stop: number
    focal_length: number
    mount_id: number
}

export interface LightType extends DeviceTypeSource{
    watts: number
    rgb: boolean
    variable_temperature: boolean
}

export interface LightTypeDTO extends LightType{}

export interface StabilizerType extends DeviceTypeSource{
    max_weight: number
    number_of_axis: number
}

export interface StabilizerTypeDTO extends StabilizerType{}

export interface TripodType extends DeviceTypeSource{
    height: number
    head: TripodHead
}

export interface TripodTypeDTO extends DeviceTypeSource{
    height: number
    head_id: number
}

export interface SimpleType extends DeviceTypeSource{
    description: string
}

export interface SimpleTypeDTO extends DeviceTypeSource{
    description: string
}


export type DeviceType = (CameraType | MicrophoneType | DroneType | LensType | LightType | StabilizerType | TripodType | SimpleType)
//endregion interfaces

export interface DeviceTypeVariantCollection {
    audioTypes: MicrophoneType[]
    cameraTypes: CameraType[]
    droneTypes: DroneType[]
    lensTypes: LensType[]
    lightTypes: LightType[]
    stabilizerTypes: StabilizerType[]
    tripodHeads: TripodType[]
}

export interface DeviceTypeFullDTO {
    deviceType: DeviceType
    available: number
    deviceTags: Tag[]
}

export interface DeviceTypeMinimalDTO {
    type_id: number
    name: string
    variant: DeviceTypeVariantEnum
    image: string
}

export interface Tag {
    tag_id: number
    description: string
}

export default class DeviceTypeService {
    static fetchAll(){
        Api.fetchData<DeviceTypeVariantCollection>("/devicetype/getall")
            .then(data => {
                model.loadDeviceTypes(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static fetchAllFull(){
        Api.fetchData<DeviceTypeFullDTO[]>("/devicetype/getallfull")
            .then(data => {
                console.log(data)
                model.loadDeviceTypesFull(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
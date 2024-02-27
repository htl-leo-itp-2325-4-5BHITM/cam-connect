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
    microphone="microphone", camera="camera", drone="drone", lens="lens", light="light", stabilizer="stabilizer", tripod="tripod"
}

export interface AudioType extends DeviceTypeSource{
    windblocker: boolean
    wireless: boolean
    needsRecorder: boolean
}

export interface AudioTypeDTO extends AudioType{}

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

export type DeviceType = (CameraType | AudioType | DroneType | LensType | StabilizerType | TripodType)

//endregion interfaces

export interface DeviceTypeVariantCollection {
    audioTypes: AudioType[]
    cameraTypes: CameraType[]
    droneTypes: DroneType[]
    lensTypes: LensType[]
    lightTypes: LightType[]
    stabilizerTypes: StabilizerType[]
    tripodHeads: TripodType[]
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
}
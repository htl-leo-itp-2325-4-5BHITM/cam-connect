import {api} from '../base'
import {model} from "../index"
import {CameraResolution, CameraSensor, CameraSystem, LensMount, TripodHead} from "./deviceTypeAttribute.service"

//region devicetype interfaces
export interface DeviceType{
    type_id: number
    name: string
    image: string
}

export interface AudioType extends DeviceType{
    windblocker: boolean
    wireless: boolean
    needsRecorder: boolean
}

export interface AudioTypeDTO extends AudioType{}

export interface CameraType extends DeviceType{
    sensor: CameraSensor
    resolution: CameraResolution
    mount: LensMount
    system: CameraSystem
    autofocus: boolean
    framerate: number
}
export interface CameraTypeDTO extends DeviceType{
    sensor_id: number
    resolution_id: number
    mount_id: number
}

export interface DroneType extends DeviceType{
    sensor: CameraSensor
    resolution: CameraResolution
    max_range: number
}

export interface DroneTypeDTO extends DeviceType{
    sensor_id: number
    resolution_id: number
    max_range: number
}

export interface LensType extends DeviceType{
    f_stop: number
    focal_length: number
    lens_mount: LensMount
}

export interface LensTypeDTO extends DeviceType{
    f_stop: number
    focal_length: number
    mount_id: number
}

export interface LightType extends DeviceType{
    watts: number
    rgb: boolean
    variable_temperature: boolean
}

export interface LightTypeDTO extends LightType{}

export interface StabilizerType extends DeviceType{
    max_weight: number
    number_of_axis: number
}

export interface StabilizerTypeDTO extends StabilizerType{}

export interface TripodType extends DeviceType{
    height: number
    head: TripodHead
}

export interface TripodTypeDTO extends DeviceType{
    height: number
    head_id: number
}

//endregion interfaces

export interface DeviceTypeCollection{
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
        api.fetchData<DeviceTypeCollection>("/devicetype/getall")
            .then(data => {
                model.loadDeviceTypes(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
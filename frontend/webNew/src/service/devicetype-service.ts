//service should request data implement and export interfaces and provide simple set update functions
import {config, handleError} from '../base'
import {Observable} from "rxjs"

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

//region devicetype attribute interfaces
interface DeviceTypeAttribute{
    attribute_id: number
    name: string
    details?: string
}

interface CameraResolution extends DeviceTypeAttribute{
    resolution: string
}

interface CameraSensor extends DeviceTypeAttribute{
    size: string
}

interface LensMount extends DeviceTypeAttribute{
}

interface TripodHead extends DeviceTypeAttribute{
}
//endregion

export type DeviceTypeCollection = (AudioType | CameraType | DroneType | LensType | LightType | StabilizerType | TripodType)[]

export function getAllDeviceTypes():Observable<DeviceTypeCollection>{
    return new Observable((subscriber) => {
        fetch(config.api_url + '/devicetype/getall')
            .then(response => {
                handleError(response.status)
                return response.json()
            })
            .then(result => {
                console.log(result)
                subscriber.next(result.data as DeviceTypeCollection)
            })
            .catch(error => {
                console.error(error)
            })
    });
}
//index should simply link between components and services
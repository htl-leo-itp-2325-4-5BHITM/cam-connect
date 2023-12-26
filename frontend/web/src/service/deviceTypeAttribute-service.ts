import {config, handleError} from '../base'
import {model} from "../index"

//region interfaces
export interface DevicetypeAttributeSource{
    attribute_id: number
    dtype: number
    name: string
    details: string
}

export interface CameraResolution extends DevicetypeAttributeSource{
    resolution: string
}

export interface CameraSensor extends DevicetypeAttributeSource{
    size: string
}

export interface CameraSystem extends DevicetypeAttributeSource{}

export interface LensMount extends DevicetypeAttributeSource{}

export interface TripodHead extends DevicetypeAttributeSource{}
//endregion

export type DeviceTypeAttribute = (CameraResolution | CameraSensor | CameraSystem | LensMount | TripodHead)
export interface DeviceTypeAttributeCollection{
    cameraResolutions: CameraResolution[]
    cameraSensors: CameraSensor[]
    cameraSystems: CameraSystem[]
    lensMounts: LensMount[]
    tripodHeads: TripodHead[]
}

export default class DeviceTypeAttributeService{
    static fetchAll(){
        fetch(config.api_url + '/devicetype/attribute/getall')
            .then(response => {
                handleError(response.status)
                return response.json()
            })
            .then(result => {
                model.setDeviceTypeAttributes(result.data as DeviceTypeAttributeCollection)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
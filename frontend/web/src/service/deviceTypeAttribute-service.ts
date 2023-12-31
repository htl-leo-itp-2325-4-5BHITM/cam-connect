import {model} from "../index"
import {apiQuery, ccResponse, config, handleCCError, handleHttpError} from "../base"

//region interfaces
export interface DevicetypeAttributeSource{
    attribute_id: number
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
        apiQuery<DeviceTypeAttributeCollection>("/devicetype/attribute/getall")
            .then(data => {
                model.setDeviceTypeAttributes(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
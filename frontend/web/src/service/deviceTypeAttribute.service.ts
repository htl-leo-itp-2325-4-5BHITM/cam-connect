import {model} from "../index"
import {Api} from "../base"

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
        Api.fetchData<DeviceTypeAttributeCollection>("/devicetype/attribute/getall")
            .then(data => {
                model.loadDeviceTypeAttributes(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
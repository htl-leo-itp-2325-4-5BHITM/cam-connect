import {model} from "../index"
import {Api} from "../Util/Api"

//region interfaces
export interface DeviceTypeAttributeSource {
    attribute_id: number
    name: string
    details: string
}

export interface CameraResolution extends DeviceTypeAttributeSource{
    resolution: string
}

export interface CameraSensor extends DeviceTypeAttributeSource{
    size: string
}

export interface CameraSystem extends DeviceTypeAttributeSource{}

export interface LensMount extends DeviceTypeAttributeSource{}

export interface TripodHead extends DeviceTypeAttributeSource{}
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
            .then(result => {
                model.loadDeviceTypeAttributes(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
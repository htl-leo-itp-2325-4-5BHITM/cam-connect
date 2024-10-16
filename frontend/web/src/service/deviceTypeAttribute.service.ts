import {model} from "../index"
import {Api} from "../util/Api"

//region interfaces
export interface DeviceTypeAttributeSource {
    attribute_id: number
    name: string
    details: string
}

export interface AudioConnector extends DeviceTypeAttributeSource{}

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

export type DeviceTypeAttribute = (CameraResolution | CameraSensor | CameraSystem | LensMount | TripodHead | AudioConnector)
export interface DeviceTypeAttributeCollection{
    cameraResolutions: CameraResolution[]
    cameraSystems: CameraSystem[]
    lensMounts: LensMount[]
    tripodHeads: TripodHead[]
    audioConnectors: AudioConnector[]
}

export default class DeviceTypeAttributeService{
    static fetchAll(){
        Api.getData<DeviceTypeAttributeCollection>("/devicetype/attribute/getall")
            .then(result => {
                console.log(result)
                model.loadDeviceTypeAttributes(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}
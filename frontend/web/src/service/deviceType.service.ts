import {ccResponse, SimpleOption} from '../base'
import {model} from "../index"
import {CameraResolution, CameraSensor, CameraSystem, LensMount, TripodHead} from "./deviceTypeAttribute.service"
import {html, TemplateResult} from "lit"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCamera, faHelicopter, faLightbulb, faMicrophone, faGears} from "@fortawesome/free-solid-svg-icons"
import stabilizerIcon from "../../assets/icon/noun-gimbal-5345717.svg"
import droneIcon from "../../assets/icon/noun-drone-6707036.svg"
import lensIcon from "../../assets/icon/noun-lens-6134156.svg"
import tripodIcon from "../../assets/icon/noun-tripod-6660204.svg"
import {Api} from "../util/Api"

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
    focal_length: string
    mount_id: number
}

export interface LightType extends DeviceTypeSource{
    watts: number
    rgb: boolean
    variable_temperature: boolean
}

export interface LightTypeDTO extends LightType{}

export interface StabilizerType extends DeviceTypeSource{
    max_weight_kilograms: number
    number_of_axis: number
}

export interface StabilizerTypeDTO extends StabilizerType{}

export interface TripodType extends DeviceTypeSource{
    height_centimeters: number
    head: TripodHead
}

export interface TripodTypeDTO extends DeviceTypeSource{
    height_centimeters: number
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

export interface Tag {
    tag_id: number
    name: string
    description: string
}

export default class DeviceTypeService {
    static fetchAll(){
        Api.fetchData<DeviceTypeVariantCollection>("/devicetype/getall")
            .then(result => {
                model.loadDeviceTypes(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static fetchAllFull(){
        Api.fetchData<DeviceTypeFullDTO[]>("/devicetype/getallfull")
            .then(result => {
                model.loadDeviceTypesFull(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(device: DeviceType) {
        Api.fetchData(`/devicetype/getbyid/${device.type_id}/remove`)
            .then(() => {
                DeviceTypeService.fetchAllFull()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static async search(searchTerm: string): Promise<SimpleOption<number, DeviceType>[]> {
        try {
            const result: ccResponse<SimpleOption<number, DeviceType>[]> = await Api.postData(
                "/devicetype/search",
                {searchTerm: searchTerm}
            )
            return result.data
        } catch (e) {
            console.error(e)
            return []
        }
    }

    static deviceTypeToIcon(data: DeviceTypeSource): TemplateResult {
        switch (data.variant){
            case DeviceTypeVariantEnum.camera: return html`${unsafeSVG(icon(faCamera).html[0])}`
            case DeviceTypeVariantEnum.microphone: return html`${unsafeSVG(icon(faMicrophone).html[0])}`
            case DeviceTypeVariantEnum.drone: return html`<img src="${droneIcon}" alt="D">`
            case DeviceTypeVariantEnum.lens: return html`<img src="${lensIcon}" alt="L">`
            case DeviceTypeVariantEnum.light: return html`${unsafeSVG(icon(faLightbulb).html[0])}`
            case DeviceTypeVariantEnum.stabilizer: return html`<img src="${stabilizerIcon}" alt="S">`
            case DeviceTypeVariantEnum.tripod: return html`<img src="${tripodIcon}" alt="T">`
            default: return html`${unsafeSVG(icon(faGears).html[0])}`
        }
    }
}
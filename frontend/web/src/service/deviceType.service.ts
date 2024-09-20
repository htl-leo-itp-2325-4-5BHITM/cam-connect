import {ccResponse, SimpleOption} from '../base'
import {model} from "../index"
import {
    AudioConnector,
    CameraSensor,
    CameraSystem,
    LensMount,
    CameraResolution,
    TripodHead
} from "./deviceTypeAttribute.service"
import {html, TemplateResult} from "lit"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCamera, faHelicopter, faLightbulb, faMicrophone, faHeadphones, faGears} from "@fortawesome/free-solid-svg-icons"
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
    image_blob: string
}

export enum DeviceTypeVariantEnum {
    audio="audio", microphone="microphone", camera="camera", drone="drone", lens="lens", light="light", stabilizer="stabilizer", tripod="tripod", simple="simple"
}

export interface AudioType extends DeviceTypeSource {
    connector: AudioConnector
}

export interface CameraType extends DeviceTypeSource{
    mount: LensMount
    system: CameraSystem
    photoResolution: CameraResolution
    autofocus: boolean
}

export interface DroneType extends DeviceTypeSource{
    max_range_kilometers: number
    flight_time_minutes: number
    requires_license: boolean
}

export interface LensType extends DeviceTypeSource{
    lens_mount: LensMount
    f_stop: string
    focal_length: string
}

export interface LightType extends DeviceTypeSource{
    watts: number
    rgb: boolean
    variable_temperature: boolean
}

export interface MicrophoneType extends DeviceTypeSource{
    connector: AudioConnector
    needs_power: boolean
    needs_recorder: boolean
}

export interface StabilizerType extends DeviceTypeSource{
    max_weight_kilograms: number
    number_of_axis: number
}

export interface TripodType extends DeviceTypeSource{
    height_centimeters: number
    head: TripodHead
}

export interface SimpleType extends DeviceTypeSource{
    description: string
}

export type DeviceType = (AudioType | CameraType | MicrophoneType | DroneType | LensType | LightType | StabilizerType | TripodType | SimpleType)
//endregion interfaces

export interface DeviceTypeVariantCollection {
    audioTypes: AudioType[]
    microphoneTypes: MicrophoneType[]
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
            case DeviceTypeVariantEnum.audio: return html`${unsafeSVG(icon(faHeadphones).html[0])}`
            default: return html`${unsafeSVG(icon(faGears).html[0])}`
        }
    }

    static update(device: DeviceType){
        Api.postData(`/devicetype/getbyid/${device.type_id}/update`, device)
            .then(() => {
                DeviceTypeService.fetchAllFull()
            })
            .catch(error => {
                console.error(error)
            })
    }
}
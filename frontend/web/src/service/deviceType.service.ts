import {Api, ccResponse} from '../base'
import {model} from "../index"
import {CameraResolution, CameraSensor, CameraSystem, LensMount, TripodHead} from "./deviceTypeAttribute.service"
import {html, TemplateResult} from "lit"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCamera, faHelicopter, faLightbulb, faMicrophone} from "@fortawesome/free-solid-svg-icons"
import {AutocompleteOption} from "../components/basic/autocomplete.component"

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
    description: string
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

    static fetchAllFull(){
        Api.fetchData<DeviceTypeFullDTO[]>("/devicetype/getallfull")
            .then(data => {
                console.log(data)
                model.loadDeviceTypesFull(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static async search(searchTerm: string): Promise<AutocompleteOption<DeviceType>[]> {
        try {
            const result: ccResponse<AutocompleteOption<DeviceType>[]> = await Api.postData(
                "/devicetype/search",
                {searchTerm: searchTerm}
            )
            console.log("queryresult", result.data)
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
            case DeviceTypeVariantEnum.drone: return html`${unsafeSVG(icon(faHelicopter).html[0])}`
            case DeviceTypeVariantEnum.lens:
            case DeviceTypeVariantEnum.light: return html`${unsafeSVG(icon(faLightbulb).html[0])}`
            case DeviceTypeVariantEnum.stabilizer:
            case DeviceTypeVariantEnum.tripod: return html`T`
            default: return html`Icon`
        }
    }
}
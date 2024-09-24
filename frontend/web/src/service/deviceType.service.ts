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
    photo_resolution: CameraResolution
    autofocus: boolean
}

export interface DroneType extends DeviceTypeSource{
    max_range_kilometers: number
    flight_time_minutes: number
    requires_license: boolean
}

export interface LensType extends DeviceTypeSource{
    mount: LensMount
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

export interface DeviceFilterDTO{
    onlyAvailable: boolean
    variants: string[]
    attributes: number[]
    tags: number[]
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
        let deviceFiltersForBackend: DeviceFilterDTO = {
            onlyAvailable: model.appState.value.deviceFilters.onlyAvailable,
            variants: Array.from(model.appState.value.deviceFilters.variants),
            attributes: Array.from(model.appState.value.deviceFilters.attributes),
            tags: Array.from(model.appState.value.deviceFilters.tags)
        }

        Api.postData<DeviceFilterDTO, DeviceTypeFullDTO[]>("/devicetype/getallfull", deviceFiltersForBackend)
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

    static deviceTypeToIcon(variant: DeviceTypeVariantEnum): TemplateResult {
        switch (variant){
            case DeviceTypeVariantEnum.camera: return html`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 40 40"><defs><style>     .cls-1 {     fill-rule: evenodd;     } </style> </defs><g><g id="Layer_1">     <path d="M25.2,21.7c0,2.9-2.3,5.2-5.2,5.2s-5.2-2.3-5.2-5.2,2.3-5.2,5.2-5.2,5.2,2.3,5.2,5.2Z"/>     <path class="cls-1" d="M3,19.7v-1.7c0-2.6,0-3.9.6-4.9.2-.3.5-.6.7-.8.9-.8,2.2-.9,4.7-1.3l3.7-.5,1.9-3c.6-1,.9-1.4,1.3-1.7.1-.1.3-.2.5-.3.5-.2,1.1-.2,2.2-.2h2.6c1.1,0,1.7,0,2.2.2.2,0,.3.2.5.3.4.3.7.8,1.3,1.7l1.9,3,3.7.5c2.6.3,3.9.5,4.7,1.3.3.2.5.5.7.8.6,1,.6,2.3.6,4.9v9c0,2.9,0,4.4-.7,5.4-.2.3-.5.6-.9.9-1,.7-2.5.7-5.4.7H10.1c-2.9,0-4.4,0-5.4-.7-.3-.2-.6-.5-.9-.9-.7-1-.7-2.5-.7-5.4v-3.4M34.4,16.2c0,.9-.7,1.6-1.6,1.6s-1.6-.7-1.6-1.6.7-1.6,1.6-1.6,1.6.7,1.6,1.6ZM29.1,21.7c0,5-4.1,9.1-9.1,9.1s-9.1-4.1-9.1-9.1,4.1-9.1,9.1-9.1,9.1,4.1,9.1,9.1Z"/>     <path d="M5.6,7.7c0-1,0-1.5.2-1.8,0-.1.2-.2.3-.3.3-.2.8-.2,1.8-.2h.5c1,0,1.5,0,1.8.2.1,0,.2.2.3.3.2.3.2.8.2,1.8v.5l-5.2.7v-1.2Z"/> </g> </g></svg>`
            case DeviceTypeVariantEnum.microphone: return html`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><path d="m8.5742 17.367c-0.45312 1.0039-1.6367 1.4531-2.6406 1-1.0039-0.45313-1.4531-1.6367-1-2.6406 0.52734-1.1602 1.168-2.2891 1.918-3.3711 0.73047-1.0625 1.5664-2.0625 2.4961-2.9961 4.2383-4.2383 9.793-6.3594 15.344-6.3594 5.5508 0 11.105 2.1211 15.344 6.3594 1.625 1.625 2.9453 3.457 3.9531 5.4141 0.94922 1.8398 1.6172 3.7969 2.0039 5.7969l21.285 24.73c0.71484 0.83594 0.61719 2.0977-0.21875 2.8125-0.83594 0.71484-2.0977 0.61719-2.8125-0.21875l-20.238-23.512-19.637 19.637 35.945 30.938 14.629-14.629-4.9062-5.7031c-0.71484-0.83594-0.61719-2.0977 0.21875-2.8125 0.83594-0.71484 2.0977-0.61719 2.8125 0.21875l18.629 21.645c0.65625 0.76562 0.62891 1.8867-0.023438 2.6211l4.7305 4.7305c0.78125 0.78125 0.78125 2.0469 0 2.8281l-12.566 12.566c-0.78125 0.78125-2.0469 0.78125-2.8281 0l-4.7266-4.7266c-0.75 0.66406-1.875 0.67188-2.6328 0.019532l-53.105-45.707c-1.9961-0.38672-3.9492-1.0547-5.7891-2.0039-1.9453-1-3.7734-2.3203-5.4102-3.957-0.67188-0.66797-1.3047-1.3906-1.8945-2.1562-0.57031-0.74219-1.1016-1.543-1.5781-2.375-0.54688-0.95312-0.21875-2.1719 0.73438-2.7188s2.1719-0.21875 2.7188 0.73438c0.37109 0.64844 0.80859 1.2969 1.2969 1.9375 0.32422 0.42188 0.67969 0.84375 1.0625 1.2578l25.016-25.016c-3.3867-3.1328-7.7031-4.7031-12.02-4.7031-4.5312 0-9.0625 1.7305-12.516 5.1836-0.76562 0.76562-1.4492 1.5859-2.043 2.4414-0.60547 0.86328-1.125 1.7852-1.5586 2.7383zm54.785 60.203 2.3242 2.0039 13.879-13.879-2.0039-2.3281-14.203 14.203zm5.3633 4.6172 6.1328 5.2812 12.602-12.602-5.2773-6.1328-13.457 13.457zm20.129-3.0625-9.7344 9.7383 3.3125 3.3125 9.7383-9.7383-3.3125-3.3125zm-46.945-37.207c-0.48828 0.48828-0.73047 1.1328-0.73047 1.7812 0 0.65234 0.24219 1.2969 0.72656 1.7852l10.707 10.699c0.48828 0.48828 1.1328 0.73047 1.7773 0.73047 0.64844 0 1.2969-0.24219 1.7812-0.72656l0.078125-0.082031c0.43359-0.47266 0.65234-1.0859 0.65234-1.7031 0-0.64844-0.24219-1.293-0.73047-1.7773l-10.703-10.703c-0.48828-0.48828-1.1328-0.73047-1.7773-0.73047-0.64844 0-1.293 0.24219-1.7812 0.73047zm-2.8281-2.8281c1.2695-1.2695 2.9414-1.9062 4.6094-1.9062s3.3359 0.63281 4.6055 1.9023l10.703 10.703c1.2695 1.2695 1.9023 2.9414 1.9023 4.6055 0 1.6094-0.59766 3.2266-1.7891 4.4805l-0.11328 0.125c-1.2773 1.2695-2.9453 1.9062-4.6094 1.9062-1.6641 0-3.3359-0.63672-4.6055-1.9023l-10.703-10.703c-1.2695-1.2773-1.9023-2.9453-1.9023-4.6094 0-1.668 0.63672-3.3359 1.9023-4.6055zm2.8828-18.312c-0.32422-1.4336-0.83203-2.8398-1.5195-4.1758-0.32812-0.63672-0.69922-1.2578-1.1094-1.8594l-24.602 24.602c0.60156 0.41016 1.2227 0.78125 1.8594 1.1094 1.3359 0.6875 2.7422 1.1953 4.1758 1.5195zm-34.949 4.8711c0.046875 1.1016-0.80859 2.0312-1.9062 2.0781-1.1016 0.046876-2.0312-0.80859-2.0781-1.9062l-0.015625-0.30859c-0.046875-1.1016 0.80859-2.0312 1.9062-2.0781 1.1016-0.046875 2.0312 0.80859 2.0781 1.9062z"/></svg>`
            case DeviceTypeVariantEnum.drone: return html`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><path d="m77 56c-2.3438-0.003906-4.668 0.38281-6.8828 1.1523-3.0547-4.2773-3.0547-10.027 0-14.305 6.0273 2.082 12.672 1.3164 18.062-2.0898 5.3906-3.4023 8.9375-9.0742 9.6445-15.41 0.70703-6.3359-1.5078-12.648-6.0156-17.156-4.5078-4.5078-10.82-6.7227-17.156-6.0156-6.3359 0.70703-12.008 4.2539-15.41 9.6445-3.4062 5.3906-4.1719 12.035-2.0898 18.062-4.2773 3.0547-10.027 3.0547-14.305 0 2.082-6.0273 1.3164-12.672-2.0898-18.062-3.4023-5.3906-9.0742-8.9375-15.41-9.6445-6.3359-0.70703-12.648 1.5078-17.156 6.0156-4.5078 4.5078-6.7227 10.82-6.0156 17.156 0.70703 6.3359 4.2539 12.008 9.6445 15.41 5.3906 3.4062 12.035 4.1719 18.062 2.0898 3.0547 4.2773 3.0547 10.027 0 14.305-6.0273-2.082-12.672-1.3164-18.062 2.0898-5.3906 3.4023-8.9375 9.0742-9.6445 15.41-0.70703 6.3359 1.5078 12.648 6.0156 17.156 4.5078 4.5078 10.82 6.7227 17.156 6.0156 6.3359-0.70703 12.008-4.2539 15.41-9.6445 3.4062-5.3906 4.1719-12.035 2.0898-18.062 4.2773-3.0547 10.027-3.0547 14.305 0-1.957 5.6445-1.418 11.859 1.4844 17.082 2.9023 5.2227 7.8906 8.9609 13.719 10.281 5.8281 1.3203 11.941 0.09375 16.809-3.3672 4.8711-3.4648 8.0352-8.8398 8.6992-14.777 0.66406-5.9375-1.2305-11.879-5.2148-16.332-3.9805-4.4531-9.6719-7.0039-15.648-7.0039zm8.2656 8.4922-4.0234 4.0234-6.3672-6.3672c0.70312-0.097657 1.4141-0.14844 2.125-0.14844 2.9414-0.003906 5.8164 0.86328 8.2656 2.4922zm-10.391-26.641 6.3672-6.3672 4.0234 4.0234c-2.4492 1.6289-5.3242 2.4961-8.2656 2.4922-0.71094 0-1.4219-0.050781-2.125-0.14844zm17.125-14.852c0.003906 2.9414-0.86328 5.8164-2.4922 8.2656l-4.3867-4.3867 0.003906 0.003906c1.6328-3.4414 0.92578-7.543-1.7656-10.234-2.6953-2.6953-6.793-3.4023-10.234-1.7656l-4.3867-4.3867c3.0273-2.0039 6.6758-2.8398 10.273-2.3516 3.5977 0.48438 6.8945 2.2578 9.2852 4.9883 2.3867 2.7344 3.7031 6.2383 3.7031 9.8672zm-27.508-8.2656 4.0234 4.0234-6.3672 6.3672c-0.097657-0.70312-0.14844-1.4141-0.14844-2.125-0.003906-2.9414 0.86328-5.8164 2.4922-8.2656zm-26.641 10.391-6.3672-6.3672 4.0234-4.0234c1.6289 2.4492 2.4961 5.3242 2.4922 8.2656 0 0.71094-0.050781 1.4219-0.14844 2.125zm-14.852-17.125c2.9414-0.003906 5.8164 0.86328 8.2656 2.4922l-4.3867 4.3867c-3.4414-1.6445-7.5469-0.9375-10.242 1.7578-2.6992 2.6992-3.4023 6.8008-1.7578 10.242l-4.3867 4.3867c-2.0039-3.0273-2.8398-6.6797-2.3555-10.277 0.48438-3.5977 2.2578-6.8945 4.9922-9.2852s6.2422-3.7031 9.8711-3.7031zm-8.2656 27.508 4.0234-4.0234 6.3672 6.3672c-0.70312 0.097657-1.4141 0.14844-2.125 0.14844-2.9414 0.003906-5.8164-0.86328-8.2656-2.4922zm10.391 26.641-6.3672 6.3672-4.0234-4.0234c2.4492-1.6289 5.3242-2.4961 8.2656-2.4922 0.71094 0 1.4219 0.050781 2.125 0.14844zm-17.125 14.852c-0.003906-2.9414 0.86328-5.8164 2.4922-8.2656l4.3867 4.3867-0.003906-0.003906c-1.6367 3.4453-0.92969 7.5469 1.7656 10.242 2.6992 2.6953 6.7969 3.3984 10.242 1.7578l4.3867 4.3867h-0.003906c-3.0273 2.0039-6.6758 2.8398-10.273 2.3555-3.5977-0.48438-6.8984-2.2578-9.2891-4.9883-2.3867-2.7344-3.7031-6.2422-3.7031-9.8711zm27.508 8.2656-4.0234-4.0234 6.3672-6.3672c0.097657 0.70312 0.14844 1.4141 0.14844 2.125 0.003906 2.9414-0.86328 5.8164-2.4922 8.2656zm-14.629-60.145c-1.1367-1.1758-1.1211-3.0469 0.035156-4.207 1.1602-1.1562 3.0312-1.1719 4.207-0.035156l11.934 11.934c3.4336 3.4336 8.0898 5.3633 12.945 5.3633s9.5117-1.9297 12.945-5.3633l11.934-11.934c1.1758-1.1367 3.0469-1.1211 4.207 0.035156 1.1562 1.1602 1.1719 3.0312 0.035156 4.207l-11.934 11.934c-3.4336 3.4336-5.3633 8.0898-5.3633 12.945s1.9297 9.5117 5.3633 12.945l11.934 11.934c1.1367 1.1758 1.1211 3.0469-0.035156 4.207-1.1602 1.1562-3.0312 1.1719-4.207 0.035156l-11.934-11.934c-3.4336-3.4336-8.0898-5.3633-12.945-5.3633s-9.5117 1.9297-12.945 5.3633l-11.934 11.934c-1.1758 1.1367-3.0469 1.1211-4.207-0.035156-1.1562-1.1602-1.1719-3.0312-0.035156-4.207l11.934-11.934c3.4336-3.4336 5.3633-8.0898 5.3633-12.945s-1.9297-9.5117-5.3633-12.945zm41.27 49.754 6.3672 6.3672-4.0234 4.0234c-1.6289-2.4492-2.4961-5.3242-2.4922-8.2656 0-0.71094 0.050781-1.4219 0.14844-2.125zm14.852 17.125c-2.9414 0.003906-5.8164-0.86328-8.2656-2.4922l4.3867-4.3906v0.003906c3.4414 1.6445 7.5469 0.9375 10.242-1.7578 2.6992-2.6992 3.4023-6.8008 1.7578-10.242l4.3906-4.3867v-0.003906c2.0039 3.0273 2.8438 6.6797 2.3555 10.281-0.48438 3.5977-2.2578 6.8984-4.9922 9.2852-2.7344 2.3906-6.2422 3.707-9.875 3.7031z"/></svg>`
            case DeviceTypeVariantEnum.lens: return html`<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" x="0px" y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve"><g><path d="M16.8,15.5C12.6,15.5,9,23.1,9,32s3.5,16.5,7.7,16.5c4.2,0,7.7-7.6,7.7-16.5S21,15.5,16.8,15.5z M16.8,20.9   c-1.1,0-3.1,3.9-3.1,11.1c0,0.6-0.5,1-1,1c-0.6,0-1-0.5-1-1c0-6.5,1.8-13.1,5.2-13.1c0.6,0,1,0.5,1,1   C17.8,20.5,17.3,20.9,16.8,20.9z"/><path d="M29.5,32c0-11.9-5.7-21.5-12.8-21.5C9.7,10.5,4,20.1,4,32s5.7,21.5,12.8,21.5C23.8,53.5,29.5,43.9,29.5,32z M16.8,50.6   C11.3,50.6,7,42.4,7,32s4.3-18.6,9.8-18.6c5.5,0,9.8,8.2,9.8,18.6S22.3,50.6,16.8,50.6z"/><path d="M41.6,14.1c-0.2-0.2-0.4-0.4-0.6-0.6c0,0,0,0,0,0c-0.1-0.1-0.2-0.2-0.2-0.2c0,0,0,0,0-0.1c-1.8-1.8-4-2.8-6.3-2.8H22.8   c5.2,3.7,8.8,12,8.8,21.5S28,49.8,22.8,53.5h11.7c2.3,0,4.4-1,6.3-2.8c0,0,0,0,0-0.1c0.1-0.1,0.2-0.1,0.2-0.2c0,0,0,0,0,0   c0.2-0.2,0.4-0.4,0.6-0.6C45,46,47.2,39.4,47.2,32C47.2,24.6,45,18,41.6,14.1z"/><path d="M51.4,13.7h-7.5c3.3,4.3,5.5,10.9,5.5,18.3s-2.1,14-5.5,18.3h7.5C56,50.3,60,41.9,60,32S56,13.7,51.4,13.7z"/></g></svg>`
            case DeviceTypeVariantEnum.light: return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" x="0px" y="0px"><path d="M25,30a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V29a1,1,0,0,0,1,1ZM16,6a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V26a2,2,0,0,1-2,2H18a2,2,0,0,1-2-2Z"/><rect x="18" y="6" width="4" height="20"/><path d="M46,58l-4.3-7.706a3,3,0,0,1-1.266,1.327L43.617,58Z"/><rect x="36" y="52" width="2.001" height="6"/><path d="M33.571,51.621a3,3,0,0,1-1.266-1.327L27.989,58.02,30.382,58Z"/><path d="M39,12H36v8h3a3,3,0,0,0,3-3V15A3,3,0,0,0,39,12Z"/><rect x="34" y="44" width="6" height="6" rx="1"/><rect x="36" y="22" width="2" height="20"/><polygon points="28 4.808 28 27.192 34 20.612 34 11.388 28 4.808"/></svg>`
            case DeviceTypeVariantEnum.stabilizer: return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" x="0px" y="0px"><path d="M27 14.5C27 16.7091 25.2091 18.5 23 18.5C20.7909 18.5 19 16.7091 19 14.5C19 12.2909 20.7909 10.5 23 10.5C25.2091 10.5 27 12.2909 27 14.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.7278C10 9.73527 10 8.739 10.4829 7.9943C10.6397 7.75254 10.8305 7.53462 11.0494 7.34727C11.7237 6.77018 12.7113 6.63851 14.6863 6.37518L17.5 6.00004L18.9425 3.69202C19.4009 2.95861 19.6301 2.5919 19.9672 2.35764C20.0781 2.28056 20.1965 2.21491 20.3207 2.1617C20.698 2 21.1304 2 21.9953 2H24.0047C24.8696 2 25.302 2 25.6793 2.1617C25.8035 2.21491 25.9219 2.28056 26.0328 2.35764C26.3699 2.5919 26.5991 2.9586 27.0575 3.69199L28.5 6.00004L31.3137 6.37518C33.2887 6.63851 34.2763 6.77018 34.9506 7.34727C35.1695 7.53462 35.3603 7.75254 35.5171 7.9943C36 8.739 36 9.73527 36 11.7278V18.6C36 20.8499 36 21.9748 35.4271 22.7634C35.242 23.0181 35.018 23.242 34.7634 23.4271C33.9748 24 32.8498 24 30.6 24H15.4C13.1502 24 12.0252 24 11.2366 23.4271C10.982 23.242 10.758 23.0181 10.5729 22.7634C10 21.9748 10 20.8499 10 18.6V16H8V21.6C8 23.8498 8 24.9748 8.57295 25.7634C8.75799 26.018 8.98196 26.242 9.23664 26.4271C10.0252 27 11.1502 27 13.4 27H28V31.2C28 31.9499 28 32.3249 27.809 32.5878C27.7473 32.6727 27.6727 32.7473 27.5878 32.809C27.3249 33 26.9499 33 26.2 33H19.8C19.0501 33 18.6751 33 18.4122 32.809C18.3273 32.7473 18.2527 32.6727 18.191 32.5878C18 32.3249 18 31.9499 18 31.2V30H15.8C11.3003 30 9.05048 30 7.47329 28.8541C6.96392 28.484 6.51598 28.0361 6.1459 27.5267C5.02575 25.985 5.00058 23.8005 5.00001 19.5H3.8C3.05005 19.5 2.67508 19.5 2.41221 19.309C2.32732 19.2473 2.25266 19.1727 2.19098 19.0878C2 18.8249 2 18.4499 2 17.7V11.3C2 10.5501 2 10.1751 2.19098 9.91221C2.25266 9.82732 2.32732 9.75266 2.41221 9.69098C2.67508 9.5 3.05005 9.5 3.8 9.5H8V13H10V11.7278ZM34 10.25C34 10.9404 33.4404 11.5 32.75 11.5C32.0596 11.5 31.5 10.9404 31.5 10.25C31.5 9.55964 32.0596 9 32.75 9C33.4404 9 34 9.55964 34 10.25ZM30 14.5C30 18.366 26.866 21.5 23 21.5C19.134 21.5 16 18.366 16 14.5C16 10.634 19.134 7.5 23 7.5C26.866 7.5 30 10.634 30 14.5Z" fill="black"/><path d="M12 3.8C12 3.05005 12 2.67508 12.191 2.41221C12.2527 2.32732 12.3273 2.25266 12.4122 2.19098C12.6751 2 13.0501 2 13.8 2H14.2C14.9499 2 15.3249 2 15.5878 2.19098C15.6727 2.25266 15.7473 2.32732 15.809 2.41221C16 2.67508 16 3.05005 16 3.8V4.2L12 4.75V3.8Z" fill="black"/><path d="M20.5 40L21 35H25L25.5 40H20.5Z" fill="black"/></svg>`
            case DeviceTypeVariantEnum.tripod: return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" x="0px" y="0px"><title>Tripod</title><g><path d="M17,18H15a2,2,0,0,1-2-2V12a2,2,0,0,1,2-2H17a2,2,0,0,1,2,2V16A2,2,0,0,1,17,18Zm0-6-2,0,0,4,2,0Zm0,4Z"/><path d="M19,8H13a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1V7A1,1,0,0,1,19,8ZM14,6h4V4H14Z"/><path d="M16,12a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0v4A1,1,0,0,1,16,12Z"/><path d="M7,30a.9.9,0,0,1-.5-.14,1,1,0,0,1-.36-1.36l7-12a1,1,0,1,1,1.72,1l-7,12A1,1,0,0,1,7,30Z"/><path d="M25,30a1,1,0,0,1-.86-.5l-7-12a1,1,0,1,1,1.72-1l7,12a1,1,0,0,1-.36,1.36A.9.9,0,0,1,25,30Z"/><path d="M16,29.09a1,1,0,0,1-1-1V17a1,1,0,0,1,2,0V28.09A1,1,0,0,1,16,29.09Z"/><path d="M8.46,11.59a1,1,0,0,1-.69-1.73l4.21-4a1,1,0,1,1,1.38,1.45l-4.21,4A1,1,0,0,1,8.46,11.59Z"/><path d="M5.82,16a1,1,0,0,1-.71-.29L3.33,13.93a1,1,0,0,1,0-1.42l3.05-3a1,1,0,0,1,1.41,0l1.78,1.78a1,1,0,0,1,0,1.42L6.52,15.71A1,1,0,0,1,5.82,16Zm-.37-2.78.37.37L7.45,12l-.36-.37Z"/></g></svg>`
            case DeviceTypeVariantEnum.audio: return html`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><path d="m24.086 53.832c-3.4023 0-6.1719 2.7695-6.1719 6.1758v25.078c0 3.4062 2.7695 6.1758 6.1719 6.1758 3.4062 0 6.1758-2.7695 6.1758-6.1758v-25.078c0-3.4062-2.7695-6.1758-6.1758-6.1758z"/><path d="m11.027 66.223v12.652c0 3.0781 2.3359 5.5938 5.3203 5.9375v-24.527c-2.9883 0.34375-5.3203 2.8594-5.3203 5.9375z"/><path d="m23.656 23.387c-0.76172-0.38281-1.4219-0.92969-1.8672-1.6289-0.42187-0.58203-0.67187-1.2969-0.77344-2.0469-11.039 9.2695-17.262 24.453-17.109 42.004-0.039062 6.6953 3.2578 10.902 5.5586 13.027v-7.6914c-0.65234-1.5742-1-3.3594-1.0156-5.3203 0.15625-16.637 5.5547-30.168 15.203-38.34z"/><path d="m78.98 19.711c-0.10547 0.75781-0.35938 1.4766-0.79297 2.0859-0.42969 0.67578-1.082 1.2148-1.8438 1.5938 9.6523 8.1719 15.047 21.703 15.203 38.328-0.015625 1.9727-0.36328 3.7578-1.0156 5.332v7.6914c2.3008-2.1211 5.5938-6.3281 5.5586-13.012 0.15625-17.562-6.0703-32.746-17.109-42.016z"/><path d="m83.652 60.285v24.527c2.9883-0.34766 5.3203-2.8594 5.3203-5.9375v-12.652c0-3.0781-2.3359-5.5938-5.3203-5.9375z"/><path d="m75.914 53.832c-3.4062 0-6.1758 2.7695-6.1758 6.1758v25.078c0 3.4062 2.7695 6.1758 6.1758 6.1758s6.1758-2.7695 6.1758-6.1758v-25.078c0-3.4062-2.7695-6.1758-6.1758-6.1758z"/><path d="m74.77 22.312c0.89844-0.17969 1.6719-0.69141 2.125-1.3945 0.51172-0.71875 0.69922-1.625 0.53516-2.5273-0.16797-0.92578-0.69141-1.7383-1.4258-2.2305-0.003906 0-0.003906-0.003906-0.007812-0.003906-7.2383-4.918-15.965-7.4141-25.941-7.4141h-0.10547c-9.9766 0-18.703 2.4961-25.941 7.4141-0.74609 0.49609-1.2656 1.3086-1.4336 2.2344-0.16406 0.90234 0.019531 1.8125 0.51172 2.4922 0.47656 0.74219 1.25 1.25 2.1484 1.4297 0.92969 0.1875 1.875 0.003906 2.6016-0.5 6.1094-4.1328 13.566-6.2305 22.164-6.2422 8.6016 0.011719 16.059 2.1094 22.16 6.2383 0.73828 0.50781 1.6875 0.6875 2.6094 0.50391z"/></svg>`
            default: return html`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><g>   <g id="Layer_1">   <g>   <path d="M12.2,22.4h-4c-.9,0-1.6.7-1.6,1.6s.7,1.6,1.6,1.6h4c.9,0,1.6-.7,1.6-1.6s-.7-1.6-1.6-1.6Z"/>   <path d="M77.2,40.8c7,0,12.6-5.7,12.6-12.6v-12.2c0-6.9-5.6-12.6-12.6-12.6s-12.6,5.7-12.6,12.6v12.2c0,6.9,5.6,12.6,12.6,12.6ZM67.3,28.3v-12.3c0-.3,0-.5,0-.8h0s0,0,0,0h0s0,0,0,0c0,0,0,0,0,0,.4-4.5,3.8-8.2,8.2-8.9.1,0,.3,0,.4,0,.1,0,.3,0,.4,0,.2,0,.5,0,.8,0,0,0,0,0,0,0h0s0,0,.1,0c.2,0,.5,0,.7,0,.1,0,.3,0,.4,0,.1,0,.2,0,.3,0,4.4.7,7.9,4.4,8.3,8.9,0,0,0,0,0,0h0c0,.3,0,.5,0,.8v12.3c0,.3,0,.5,0,.8h0s0,0,0,0c-.4,4.5-3.8,8.2-8.3,8.9-.1,0-.2,0-.3,0-.1,0-.3,0-.4,0-.2,0-.5,0-.7,0,0,0,0,0-.1,0h0s0,0,0,0c-.3,0-.5,0-.7,0-.1,0-.3,0-.4,0-.1,0-.3,0-.4,0-4.4-.7-7.9-4.4-8.2-8.9,0,0,0,0,0,0h0c0-.3,0-.5,0-.8Z"/>   <path d="M26,21.1c-6.4,0-11.5,5.2-11.5,11.5s5.2,11.5,11.5,11.5,11.5-5.2,11.5-11.5-5.2-11.5-11.5-11.5ZM26,40.9c-4.6,0-8.3-3.7-8.3-8.3s3.7-8.3,8.3-8.3,8.4,3.7,8.4,8.3-3.7,8.3-8.4,8.3Z"/>   <path d="M50.8,45.1v-25.1c0-2-1.6-3.5-3.5-3.5h-4.4v-1.2c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6,1.6v1.2h-6.2l-1.3-3.4c-.2-.6-.8-1-1.5-1h-9.5c-.7,0-1.2.4-1.5,1l-1.3,3.4H4.7c-1.9,0-3.5,1.6-3.5,3.5v25.1c0,2,1.6,3.5,3.5,3.5h42.5c1.9,0,3.5-1.6,3.5-3.5ZM22.3,15.3h7.3l.5,1.2h-8.2l.5-1.2ZM4.4,45.1v-25.1c0-.2.2-.4.4-.4h42.5c.2,0,.4.2.4.4v25.1c0,.2-.2.4-.4.4H4.7c-.2,0-.4-.2-.4-.4Z"/>   <path d="M74.6,71.2c-.4-.3-1-.4-1.4-.2l-9.2,3.1v-1.2c0-2.2-1.8-4-4-4h-2.9c.5-.9.8-2,.8-3.2,0-3.5-2.8-6.3-6.3-6.3s-6.3,2.8-6.3,6.3.3,2.2.8,3.2h-3.3c1.9-1.9,3-4.5,3-7.3,0-5.8-4.7-10.5-10.5-10.5s-10.5,4.7-10.5,10.5,1.1,5.4,3,7.3h-1.6c-2.2,0-4,1.8-4,4v21.8c0,2.2,1.8,4,4,4h33.9c2.2,0,4-1.8,4-4v-1.2l9.2,3.1c.2,0,.3,0,.5,0,.3,0,.7-.1.9-.3.4-.3.7-.8.7-1.3v-22.7c0-.5-.2-1-.7-1.3ZM51.6,62.6c1.7,0,3.1,1.4,3.1,3.2s-1.4,3.2-3.1,3.2c-1.7,0-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2ZM35.2,54.2c4,0,7.3,3.3,7.3,7.3s-3.3,7.3-7.3,7.3-7.3-3.3-7.3-7.3,3.3-7.3,7.3-7.3ZM60.8,94.7c0,.4-.4.8-.8.8H26.1c-.4,0-.8-.4-.8-.8v-21.8c0-.4.4-.8.8-.8h33.9c.4,0,.8.4.8.8v21.8ZM72.1,92.9l-8.1-2.7v-12.8l8.1-2.7v18.2Z"/>   <path d="M94.9,23.3c-1.9,0-3.5,1.5-3.5,3.5v1.5c0,3.8-1.5,7.3-4.2,10-2.7,2.7-6.3,4.2-10,4.2s-7.3-1.5-10-4.2c-2.7-2.7-4.2-6.3-4.2-10v-1.5c0-1.9-1.5-3.5-3.5-3.5s-3.5,1.5-3.5,3.5v1.5c0,5.6,2.2,10.9,6.2,14.9,3.1,3.1,7.1,5.2,11.5,5.9v8.4h-6.1c-1.9,0-3.5,1.5-3.5,3.5s1.5,3.5,3.5,3.5h19c1.9,0,3.5-1.6,3.5-3.5s-1.5-3.5-3.5-3.5h-6.1v-8.4c4.3-.7,8.3-2.8,11.5-5.9,4-4,6.2-9.3,6.2-14.9v-1.5c0-1.9-1.5-3.5-3.5-3.5ZM95.7,28.2h0c0,4.9-1.9,9.5-5.4,13-3,3-6.9,4.9-11,5.3-.7,0-1.2.6-1.2,1.3v10.9c0,.7.6,1.3,1.3,1.3h7.4c.4,0,.8.4.8.8s-.4.8-.8.8h-19c-.4,0-.8-.4-.8-.8s.4-.8.8-.8h7.4c.7,0,1.3-.6,1.3-1.3v-10.9c0-.7-.5-1.2-1.2-1.3-4.1-.4-8.1-2.3-11-5.3-3.5-3.5-5.4-8.1-5.4-13v-1.5c0-.4.4-.8.8-.8s.8.4.8.8v1.5c0,4.5,1.8,8.7,5,11.9,3.2,3.2,7.4,5,11.9,5s8.7-1.8,11.9-5,5-7.4,5-11.9v-1.5c0-.4.4-.8.8-.8s.8.4.8.8v1.5Z"/>   <path d="M50.9,81.6l-10.8-6.2c-.8-.5-1.8-.5-2.5,0-.8.5-1.3,1.3-1.3,2.2v12.5c0,.9.5,1.8,1.3,2.2.4.2.8.3,1.3.3s.9-.1,1.3-.3l10.8-6.2c.8-.5,1.3-1.3,1.3-2.2s-.5-1.8-1.3-2.2ZM39.5,89v-10.3l8.9,5.2-8.9,5.2Z"/> </g> </g> </g></svg>`
        }
    }

    static create(deviceType: DeviceType, tags: Tag[]){
        Api.postData(`/devicetype/create/${deviceType.variant}`, deviceType)
            .then((deviceType) => {
                DeviceTypeService.fetchAllFull()

                tags.forEach(tag => {
                    DeviceTypeService.toggleTag(tag, deviceType.data)
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

    static update(deviceType: DeviceType){
        Api.postData(`/devicetype/getbyid/${deviceType.type_id}/update`, deviceType)
            .then(() => {
                DeviceTypeService.fetchAllFull()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static toggleTag(tag: Tag, deviceType: DeviceType){
        console.log(tag, deviceType)
        Api.postData(`/devicetype/getbyid/${deviceType.type_id}/tag/${tag.tag_id}/toggle`, tag)
            .then(() => {
                DeviceTypeService.fetchAllFull()
            })
            .catch(error => {
                console.error(error)
            })
    }
}
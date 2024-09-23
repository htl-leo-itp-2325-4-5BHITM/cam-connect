import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditPageEnum, ObservedProperty} from "../../../model"
import DeviceTypeService, {
    AudioType,
    CameraType, DeviceType,
    DeviceTypeFullDTO,
    DeviceTypeVariantEnum,
    DroneType,
    LensType,
    LightType,
    MicrophoneType,
    SimpleType,
    StabilizerType,
    Tag,
    TripodType
} from "../../../service/deviceType.service"
import {model} from "../../../index"
import styles from '../../../../styles/components/app/edit/editModal.styles.scss'
import {AppState} from "../../../AppState"
import TagService from "../../../service/tag.service"
import {InputType} from "../../basic/input.component"
import {ColorEnum, SizeEnum} from "../../../base"
import {ChipType} from "../../basic/chip.component"
import DeviceService, {Device} from "../../../service/device.service"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faTag} from "@fortawesome/free-solid-svg-icons"
import {LensMount} from "../../../service/deviceTypeAttribute.service"

@customElement('cc-edit-modal')
export class EditModalComponent extends LitElement {
    @property() private element: Device | DeviceTypeFullDTO | null

    @property() private appState: ObservedProperty<AppState>

    @property() private editPageType : EditPageEnum

    @property() private isEditMode : boolean = true;

    currentEditType : DeviceTypeVariantEnum = DeviceTypeVariantEnum.camera

    tags: Tag[] = []

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        if(this.element == null && this.editPageType == EditPageEnum.DEVICETYPE){
            return html`
                <style>${styles}</style>
                
                <h1>Gerätetyp Erstellen</h1>
                
                <div class="selectType">
                ${
                    model.deviceTypeNameFilterOptions.value.map(option => {
                        return html`<div @click="${() => {this.setType(DeviceTypeVariantEnum[option.id])}}">
                            ${DeviceTypeService.deviceTypeToIcon(DeviceTypeVariantEnum[option.id])}
                            ${option.name}
                        </div>`
                    })
                }
                </div>
            `
        }

        return html`
            <style>${styles}</style>
            ${this.getModalContent(this.editPageType)}

            <div class="navigation">
                <cc-button color="${ColorEnum.GRAY}" @click="${() => {model.appState.value.closeOverlay()}}">Abbrechen</cc-button>
                <cc-button @click="${() => {this.updateElement(this.editPageType, this.element)}}">Speichern</cc-button>
            </div>
        `
    }

    setType(type: DeviceTypeVariantEnum){
        this.currentEditType = type

        this.element = {
            deviceType: {} as DeviceType,
            available: 0,
            deviceTags: []
        } as DeviceTypeFullDTO

        switch (type) {
            case DeviceTypeVariantEnum.camera: this.element.deviceType = {variant: DeviceTypeVariantEnum.camera} as CameraType; break;
            case DeviceTypeVariantEnum.drone: this.element.deviceType = {variant: DeviceTypeVariantEnum.drone} as DroneType; break;
            case DeviceTypeVariantEnum.microphone: this.element.deviceType = {variant: DeviceTypeVariantEnum.microphone} as MicrophoneType; break;
            case DeviceTypeVariantEnum.lens: this.element.deviceType = {variant: DeviceTypeVariantEnum.lens} as LensType; break;
            case DeviceTypeVariantEnum.light: this.element.deviceType = {variant: DeviceTypeVariantEnum.light} as LightType; break;
            case DeviceTypeVariantEnum.audio: this.element.deviceType = {variant: DeviceTypeVariantEnum.audio} as AudioType; break;
            case DeviceTypeVariantEnum.stabilizer: this.element.deviceType = {variant: DeviceTypeVariantEnum.stabilizer} as StabilizerType; break;
            case DeviceTypeVariantEnum.tripod: this.element.deviceType = {variant: DeviceTypeVariantEnum.tripod} as TripodType; break;
            case DeviceTypeVariantEnum.simple: this.element.deviceType = {variant: DeviceTypeVariantEnum.simple} as SimpleType; break;
        }

        console.log(this.element.deviceType)
    }

    getModalContent(editPageType: EditPageEnum){
        if(editPageType == EditPageEnum.DEVICETYPE){
            this.element = this.element as DeviceTypeFullDTO

            this.currentEditType = this.element.deviceType.variant

            let deviceType = this.element.deviceType
            let tags = this.element.deviceTags

            return html`
                <h1>Gerätetyp ${this.isEditMode ? 'Bearbeiten' : 'Erstellen'}</h1>
                <cc-input label="Name" text="${deviceType.name}" .onInput="${(value) => {
                    deviceType.name = value
                }}"></cc-input>
                <cc-input label="Bild" type="${InputType.UPLOAD}"></cc-input>
                
                <div class="separator">
                    <cc-line></cc-line>
                </div>
                
                <div class="contentByDeviceType">
                    ${this.getModalContentByDeviceType()}
                </div>

                <div class="separator">
                    <cc-line></cc-line>
                </div>               
                
                <div class="tags">
                    <cc-autocomplete label="Tags" class="tagSelector" color="${ColorEnum.GRAY}" size="${SizeEnum.MEDIUM}"
                                     .onSelect="${(option: Tag) => {
                                            tags.push(option)
                                        }}"
                                     .querySuggestions="${TagService.search}"
                                     .contentProvider="${(data: Tag) => {return `${data.name}`}}"
                                     .iconProvider="${()=>{return html`${unsafeSVG(icon(faTag).html[0])}`}}"
                    ></cc-autocomplete>
                    
                    <div>
                        ${
                            tags.map(elem => {
                                return html`<cc-chip text="${elem.name}" color="${ColorEnum.GRAY}" type="${ChipType.REMOVABLE}"></cc-chip>`
                            })
                        }
                    </div>
                </div>
            `
        }

        if(editPageType == EditPageEnum.DEVICE){
            this.element = this.element as Device
            return html`
                <h1>Gerät Erstellen</h1>
                                    
                <cc-input label="Gerätenummer"></cc-input>
                <cc-input label="Seriennummer"></cc-input>
            `
        }
    }

    getModalContentByDeviceType(){
        let deviceType = this.element as DeviceTypeFullDTO
        switch(this.currentEditType){
            case DeviceTypeVariantEnum.camera:
                let cameraType = deviceType.deviceType as CameraType
                return html`
                <div>
                    <p>Mount</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.lensMounts?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                            .selected="${{id: cameraType?.mount?.attribute_id, data: cameraType?.mount?.name}}"
                            .onSelect="${(option: {id: number, data: string}) => {
                                cameraType.mount = model.deviceTypeAttributes.value.lensMounts.find(elem => elem.attribute_id == option.id)
                            }}"
                    ></cc-dropdown>
                </div>
                
                <div>
                    <p>System</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraSystems?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                            .selected="${{id: cameraType?.system?.attribute_id, data: cameraType?.system?.name}}"
                            .onSelect="${(option: {id: number, data: string}) => {
                                cameraType.system = model.deviceTypeAttributes.value.cameraSystems.find(elem => elem.attribute_id == option.id)
                            }}"
                    ></cc-dropdown>
                </div>

                <div>
                    <p>Photo Resolution</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraResolutions?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                            .selected="${{id: cameraType?.photo_resolution?.attribute_id, data: cameraType?.photo_resolution?.name}}"
                            .onSelect="${(option: {id: number, data: string}) => {
                                cameraType.photo_resolution = model.deviceTypeAttributes.value.cameraResolutions.find(elem => elem.attribute_id == option.id)
                            }}"
                    ></cc-dropdown>
                </div>
                
                <cc-toggle .toggled="${cameraType.autofocus}" .onToggle="${(option => {
                    cameraType.autofocus = option
                })}">Autofokus</cc-toggle>
            `
            case DeviceTypeVariantEnum.drone:
                let droneType = deviceType.deviceType as DroneType
                return html`
                <cc-input label="Maximale Reichweite (km)" text="${droneType.max_range_kilometers}" .onInput="${text => {
                    droneType.max_range_kilometers = text
                }}"></cc-input>
                <cc-input label="Flugzeit (min)" text="${droneType.flight_time_minutes}" .onInput="${text => {
                    droneType.flight_time_minutes = text
                }}"></cc-input>
                <cc-toggle .toggled="${droneType.requires_license}" .onToggle="${(option => {
                    droneType.requires_license = option
                })}">Benötigt Lizenz</cc-toggle>
                `
            case DeviceTypeVariantEnum.microphone:
                let microphoneType = deviceType.deviceType as MicrophoneType
                return html`
                    <div>
                        <p>Audio connector</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.audioConnectors?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                                .selected="${{id: microphoneType?.connector?.attribute_id, data: microphoneType?.connector?.name}}"
                                .onSelect="${(option: {id: number, data: string}) => {
                                    microphoneType.connector = model.deviceTypeAttributes.value.audioConnectors.find(elem => elem.attribute_id == option.id)
                                }}"
                        ></cc-dropdown>
                    </div>
                    <cc-toggle .toggled="${microphoneType.needs_power}" .onToggle="${value => {microphoneType.needs_power = value}}">Benötigt Strom</cc-toggle>
                    <cc-toggle .toggled="${microphoneType.needs_recorder}" .onToggle="${value => {microphoneType.needs_recorder = value}}">Needs Recorder</cc-toggle>
                `
            case DeviceTypeVariantEnum.lens:
                let lensType = deviceType.deviceType as LensType
                return html`
                    <cc-input label="Lichtstärke" text="${lensType.f_stop}" .onInput="${text => {
                        lensType.f_stop = text
                    }}"></cc-input>
                    <cc-input label="Brennweite" text="${lensType.focal_length}" .onInput="${text => {
                        lensType.focal_length = text
                    }}"></cc-input>
                    <div>
                        <p>Lens Mount</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.lensMounts.map(option => ({ id: option.attribute_id, data: option.name }))}"
                                .selected="${{id: lensType?.lens_mount?.attribute_id, data: lensType?.lens_mount?.name}}"
                                .onSelect="${(option: {id: number, data: string}) => {
                                    lensType.lens_mount = model.deviceTypeAttributes.value.lensMounts.find(elem => elem.attribute_id == option.id)
                                }}"
                        ></cc-dropdown>
                    </div>                
                `
            case DeviceTypeVariantEnum.light:
                let lightType = deviceType.deviceType as LightType
                return html`
                    <cc-input label="Watts" text="${lightType.watts}" .onInput="${text => {
                        lightType.watts = text
                    }}"></cc-input>
                    <cc-toggle .toggled="${lightType.rgb}" .onToggle="${value => {lightType.rgb = value}}">RGB</cc-toggle>
                    <cc-toggle .toggled="${lightType.variable_temperature}" .onToggle="${value => {lightType.variable_temperature = value}}">Variable Temperaturen</cc-toggle>
                `
            case DeviceTypeVariantEnum.audio:
                let audioType = deviceType.deviceType as AudioType
                return html`
                    <div>
                        <p>Audio connector</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.audioConnectors?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                                .selected="${{id: audioType?.connector?.attribute_id, data: audioType?.connector?.name}}"
                                .onSelect="${(option: {id: number, data: string}) => {
                                    audioType.connector = model.deviceTypeAttributes.value.audioConnectors.find(elem => elem.attribute_id == option.id)
                                }}"
                        ></cc-dropdown>
                    </div>`
            case DeviceTypeVariantEnum.stabilizer:
                let stabilizerType = deviceType.deviceType as StabilizerType
                return html`
                    <cc-input label="Maximales Gewicht (kg)" text="${stabilizerType.max_weight_kilograms}" .onInput="${text => {
                        stabilizerType.max_weight_kilograms = text
                    }}"></cc-input>
                    <cc-input label="Anzahl an Achsen" text="${stabilizerType.number_of_axis}" .onInput="${text => {
                        stabilizerType.number_of_axis = text
                    }}"></cc-input>
                `
            case DeviceTypeVariantEnum.tripod:
                let tripodType = deviceType.deviceType as TripodType
                return html`
                    <cc-input label="Höhe (cm)" text="${tripodType.height_centimeters}" .onInput="${text => {
                            tripodType.height_centimeters = text
                    }}"></cc-input>
                    <div>
                        <p>Head</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.tripodHeads.map(option => ({ id: option.attribute_id, data: option.name }))}"
                                .selected="${{id: tripodType?.head?.attribute_id, data: tripodType?.head?.name}}"
                                .onSelect="${(option: {id: number, data: string}) => {
                                    tripodType.head = model.deviceTypeAttributes.value.tripodHeads.find(elem => elem.attribute_id == option.id)
                                }}"
                    ></cc-dropdown>
                    </div>                   
                        `
            case DeviceTypeVariantEnum.simple:
                let simpleType = deviceType.deviceType as SimpleType
                return html`
                    <cc-input label="Beschreibung" text="${simpleType.description}" .onInput="${text => {
                        simpleType.description = text
                    }}"></cc-input>
                `
        }
    }

    private updateElement(editPageType: EditPageEnum, element: Device | DeviceTypeFullDTO) {
        console.log(element)
        if(editPageType == EditPageEnum.DEVICETYPE){
            DeviceTypeService.update((element as DeviceTypeFullDTO).deviceType)
        } else {
            DeviceService.update(element as Device)
        }

        model.appState.value.closeOverlay()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit-modal": EditModalComponent;
    }
}

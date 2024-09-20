import {html, LitElement, PropertyValues, render} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import PopupEngine from "../../../util/PopupEngine";
import {EditPageEnum, ObservedProperty} from "../../../model"
import DeviceTypeService, {
    CameraType,
    DeviceTypeFullDTO,
    DeviceTypeVariantEnum, DroneType, MicrophoneType,
    Tag
} from "../../../service/deviceType.service"
import {model} from "../../../index"
import styles from '../../../../styles/components/app/edit/editModal.styles.scss'
import {AppState} from "../../../AppState"
import TagService from "../../../service/tag.service"
import {InputType} from "../../basic/input.component"
import {ColorEnum, SizeEnum} from "../../../base"
import {ChipType} from "../../basic/chip.component"
import DeviceService, {Device} from "../../../service/device.service"

@customElement('cc-edit-modal')
export class EditModalComponent extends LitElement {
    @property() private element: Device | DeviceTypeFullDTO

    @property() private appState: ObservedProperty<AppState>

    @property() private editPageType : EditPageEnum

    currentEditType : DeviceTypeVariantEnum = DeviceTypeVariantEnum.camera

    isSelectAlreadyUsed : boolean = false

    tags: Tag[] = []

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        return html`
            <style>${styles}</style>
            ${this.getModalContent(this.editPageType)}

            <div class="navigation">
                <cc-button color="${ColorEnum.GRAY}" @click="${() => {this.closeModal()}}">Abbrechen</cc-button>
                <cc-button @click="${() => {this.updateElement(this.editPageType, this.element)}}">Speichern</cc-button>
            </div>
        `
    }

    getModalContent(editPageType: EditPageEnum){
        if(editPageType == EditPageEnum.DEVICETYPE){
            this.element = this.element as DeviceTypeFullDTO
            this.tags = this.element.deviceTags

            this.currentEditType = this.element.deviceType.variant

            return html`
                <h1>Gerätetyp Erstellen</h1>
                <cc-input label="Name" text="${this.element.deviceType.name}"></cc-input>
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
                                            this.tags.push(option)
                                        }}"
                                     .querySuggestions="${TagService.search}"
                                     .contentProvider="${(data: Tag) => {return `${data.name}`}}"
                    ></cc-autocomplete>
                    
                    <div>
                        ${
                            this.tags.map(elem => {
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
                                    <cc-autocomplete label="Tags" class="tagSelector" color="${ColorEnum.GRAY}" size="${SizeEnum.MEDIUM}"
                                     .selected="${{id: this.tags[0]?.tag_id, data: this.tags[0]?.name}}"
                                     .onSelect="${(option: Tag) => {
                                            this.tags.push(option)
                                        }}"
                                     .querySuggestions="${TagService.search}"
                                     .contentProvider="${(data: Tag) => {return `${data.name}`}}"
                    ></cc-autocomplete>
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
                    ></cc-dropdown>
                </div>
                
                <div>
                    <p>System</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraSystems?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                            .selected="${{id: cameraType?.system?.attribute_id, data: cameraType?.system?.name}}"
                    ></cc-dropdown>
                </div>

                <div>
                    <p>Photo Resolution</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraResolution?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                            .selected="${{id: cameraType?.photo_resolution?.attribute_id, data: cameraType?.photo_resolution?.name}}"
                    ></cc-dropdown>
                </div>
                
                <cc-toggle .toggled="${cameraType.autofocus}">Autofokus</cc-toggle>
            `
            case DeviceTypeVariantEnum.drone:
                let droneType = deviceType.deviceType as DroneType
                return html`
                <cc-input label="Maximale Reichweite (km)" text="${droneType.max_range_kilometers}"></cc-input>
                <cc-input label="Flugzeit (min)" text="${droneType.flight_time_minutes}"></cc-input>
                <cc-toggle .toggled="${droneType.requires_license}">Benötigt Lizenz</cc-toggle>
                `
            case DeviceTypeVariantEnum.microphone:
                let microphoneType = deviceType.deviceType as MicrophoneType
                return html`
                    <div>
                        <p>Audio connector</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.audioConnectors?.map(option => ({ id: option.attribute_id, data: option.name }))}"
                                .selected="${{id: microphoneType?.connector?.attribute_id, data: microphoneType?.connector?.name}}"
                        ></cc-dropdown>
                    </div>
                    <cc-toggle .toggled="${microphoneType.needs_power}">Benötigt Strom</cc-toggle>
                    <cc-toggle>Wireless</cc-toggle>
                    <cc-toggle>Needs Recorder</cc-toggle>
                `
            case DeviceTypeVariantEnum.lens:
                return html`
                    <cc-input label="f-stop"></cc-input>
                    <cc-input label="Brennweite"></cc-input>
                    <div>
                        <p>Lens Mount</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.lensMounts.map(option => ({ id: option.attribute_id, data: option.name }))}"
                        ></cc-dropdown>
                    </div>                
                `
            case DeviceTypeVariantEnum.light:
                return html`
                    <cc-input label="Watts"></cc-input>
                    <cc-toggle>RGB</cc-toggle>
                    <cc-toggle>Variable Temperaturen</cc-toggle>
                `
            case DeviceTypeVariantEnum.stabilizer:
                return html`
                    <cc-input label="Maximales Gewicht (kg)"></cc-input>
                    <cc-input label="Anzahl an Achsen"></cc-input>
                `
            case DeviceTypeVariantEnum.tripod:
                return html`
                    <cc-input label="Höhe (cm)"></cc-input>
                    <div>
                        <p>Head</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.tripodHeads.map(option => ({ id: option.attribute_id, data: option.name }))}"
                        ></cc-dropdown>
                    </div>                   
                `
            case DeviceTypeVariantEnum.simple:
                return html`
                    <cc-input label="Beschreibung"></cc-input>
                `
        }
    }

    closeModal(){
        this.shadowRoot.querySelector(".editModal").setAttribute("hidden", "hidden")
    }

    private updateElement(editPageType: EditPageEnum, element: Device | DeviceTypeFullDTO) {
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

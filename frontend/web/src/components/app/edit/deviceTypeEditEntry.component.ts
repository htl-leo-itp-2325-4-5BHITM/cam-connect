import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEditEntry.styles.scss'
import DeviceTypeService, {
    AudioType,
    CameraType, DeviceType,
    DeviceTypeFullDTO,
    DroneType,
    LensType,
    LightType,
    MicrophoneType,
    StabilizerType,
    TripodType
} from "../../../service/deviceType.service"
import {ColorEnum, SizeEnum} from "../../../base"
import {faListUl, faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import UrlHandler from "../../../util/UrlHandler"
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import {EditComponent} from "./edit.component"
import PopupEngine from "../../../util/PopupEngine"
import RentService from "../../../service/rent.service"
import DeviceService from "../../../service/device.service"

@customElement('cc-device-type-edit-entry')
export class DeviceTypeEditEntryComponent extends LitElement {
    @property()
    deviceType: DeviceTypeFullDTO

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <h3>${this.deviceType.deviceType.name}</h3>
            
            <div class="tags">
                ${this.deviceType.deviceTags.map(elem => {
                    return html`<cc-chip text="${elem.name}" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"></cc-chip>`
                })}
            </div>
            
            <div class="deviceTypes">
                ${this.deviceType.deviceType.variant == "camera" ? this.renderCamera(this.deviceType.deviceType as CameraType) : ''}
                ${this.deviceType.deviceType.variant == "drone" ? this.renderDrone(this.deviceType.deviceType as DroneType) : ''}
                ${this.deviceType.deviceType.variant == "lens" ? this.renderLens(this.deviceType.deviceType as LensType) : ''}
                ${this.deviceType.deviceType.variant == "light" ? this.renderLight(this.deviceType.deviceType as LightType) : ''}
                ${this.deviceType.deviceType.variant == "audio" ? this.renderAudio(this.deviceType.deviceType as AudioType) : ''}
                ${this.deviceType.deviceType.variant == "microphone" ? this.renderMicrophone(this.deviceType.deviceType as MicrophoneType) : ''}
                ${this.deviceType.deviceType.variant == "stabilizer" ? this.renderStabilizer(this.deviceType.deviceType as StabilizerType) : ''}
                ${this.deviceType.deviceType.variant == "tripod" ? this.renderTripod(this.deviceType.deviceType as TripodType) : ''}
            </div>

            <div class="edit">
                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${() => {UrlHandler.setUrl('/app/edit/children?gid=' + this.deviceType.deviceType.type_id)}}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faListUl).html[0])}
                    </div>
                    <p>Zugehörige Geräte</p>    
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"  @click="${() => {
                    //UrlHandler.updateUrl('/app/edit/devicetype?gid=' + this.deviceType.deviceType.type_id)
                    (model.appState.value.originElement as EditComponent).showModal(this.deviceType, false, EditPageEnum.DEVICETYPE)
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${() => {this.removeDeviceType(this.deviceType.deviceType)}}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    <p>Löschen</p>
                </cc-button>
            </div>
            
            <cc-circle-select .checked="${this.appState.value.selectedDeviceTypeEditEntries.has(this)}" 
                              @click="${() => {model.appState.value.toggleSelectedDeviceTypeEditEntry(this)}}">
            </cc-circle-select>
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value != undefined ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }

    renderCamera(cameraType : CameraType){
        return html`
            ${this.getPropertyValue("Mount", cameraType.mount?.name)}
            ${this.getPropertyValue("System", cameraType.system?.name)}
            ${this.getPropertyValue("Foto Resolution", cameraType.photo_resolution?.name)}
            ${this.getPropertyValue("Autofokus", cameraType.autofocus)}
        `
    }

    renderDrone(droneType : DroneType) {
        return html`
            ${this.getPropertyValue("Maximale Reichweite (km)", droneType.max_range_kilometers)}
            ${this.getPropertyValue("Flugzeit (min)", droneType.flight_time_minutes)}
            ${this.getPropertyValue("Benötigt Lizenz", droneType.requires_license)}
        `
    }

    renderLens(lensType : LensType){
        return html`
            ${this.getPropertyValue("F-Stop", lensType.f_stop)}
            ${this.getPropertyValue("Lens Mount", lensType.lens_mount?.name)}
            ${this.getPropertyValue("Focal Length", lensType.focal_length)}
        `
    }

    renderLight(lightType : LightType){
        return html`
            ${this.getPropertyValue("RGB", lightType.rgb)}
            ${this.getPropertyValue("Variable Temperatur", lightType.variable_temperature)}
            ${this.getPropertyValue("Watt", lightType.watts)}
        `
    }

    renderMicrophone(microphoneType : MicrophoneType){
        return html`
            ${this.getPropertyValue("Connector", microphoneType.connector?.name)}
            ${this.getPropertyValue("Benötigt Strom", microphoneType.needs_power)}
            ${this.getPropertyValue("Benötigt Recorder", microphoneType.needs_recorder)}
        `
    }

    renderAudio(audioType : AudioType){
        return html`
            ${this.getPropertyValue("Connector", audioType.connector?.name)}
        `
    }

    renderStabilizer(stabilizerType : StabilizerType){
        return html`
            ${this.getPropertyValue("Number of axis", stabilizerType.number_of_axis)}
            ${this.getPropertyValue("Max weight kilograms", stabilizerType.max_weight_kilograms)}
        `
    }

    renderTripod(tripodType : TripodType){
        return html`
            ${this.getPropertyValue("Head", tripodType.head?.name)}
            ${this.getPropertyValue("Höhe in Zentimeter", tripodType.height_centimeters)}
        `
    }

    removeDeviceType(deviceType: DeviceType){
        PopupEngine.createModal({
            text: `Möchten Sie den Gerätetyp ${deviceType.name} wirklich löschen?`,
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        DeviceTypeService.remove(deviceType)
                        this.appState.value.clearSelectedDeviceTypeEditEntries()
                        this.appState.value.clearSelectedDeviceEditEntries()
                   },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-edit-entry": DeviceTypeEditEntryComponent
    }
}
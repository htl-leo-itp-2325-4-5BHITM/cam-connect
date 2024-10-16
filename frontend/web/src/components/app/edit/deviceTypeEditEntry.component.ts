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
    MicrophoneType, SimpleType,
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
                ${this.deviceType.deviceType.variant == "simple" ? this.renderSimple(this.deviceType.deviceType as SimpleType) : ''}
            </div>

            <div class="edit">
                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${(event) => {
                    UrlHandler.setUrl('/app/edit/children?gid=' + this.deviceType.deviceType.type_id)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faListUl).html[0])}
                    </div>
                    <p>Zugehörige Geräte</p>    
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"  @click="${(event) => {
                    //UrlHandler.updateUrl('/app/edit/devicetype?gid=' + this.deviceType.deviceType.type_id)
                    (model.appState.value.originElement as EditComponent).showModal(this.deviceType, true, EditPageEnum.DEVICETYPE)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${(event) => {
                    this.removeDeviceType(this.deviceType.deviceType)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    <p>Löschen</p>
                </cc-button>
            </div>
            
            <cc-circle-select .checked="${this.appState.value.selectedDeviceTypeEditEntries.has(this)}" 
                              @click="${(event) => {model.appState.value.toggleSelectedDeviceTypeEditEntry(this)
                                event.stopPropagation()
                              }}">
            </cc-circle-select>
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value != undefined ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }

    renderCamera(cameraType : CameraType){
        return html`
            ${this.getPropertyValue("Objektiv Anschluss", cameraType.mount?.name)}
            ${this.getPropertyValue("System", cameraType.system?.name)}
            ${this.getPropertyValue("Foto Auflösung", cameraType.photo_resolution?.name)}
            ${this.getPropertyValue("Autofokus", cameraType.autofocus)}
        `
    }

    renderDrone(droneType : DroneType) {
        return html`
            ${this.getPropertyValue("Maximale Reichweite (km)", droneType.max_range_kilometers)}
            ${this.getPropertyValue("Maximale Flugzeit (min)", droneType.flight_time_minutes)}
            ${this.getPropertyValue("Benötigt Lizenz", droneType.requires_license)}
        `
    }

    renderLens(lensType : LensType){
        return html`
            ${this.getPropertyValue("Anschluss", lensType.mount?.name)}
            ${this.getPropertyValue("Maximale Blende", lensType.f_stop)}
            ${this.getPropertyValue("Brennweite", lensType.focal_length)}
        `
    }

    renderLight(lightType : LightType){
        return html`
            ${this.getPropertyValue("RGB Farben", lightType.rgb)}
            ${this.getPropertyValue("Stärke (Watt)", lightType.watts)}
            ${this.getPropertyValue("Farbtemperatur verstellbar", lightType.variable_temperature)}
        `
    }

    renderMicrophone(microphoneType : MicrophoneType){
        return html`
            ${this.getPropertyValue("Audio Connector", microphoneType.connector?.name)}
            ${this.getPropertyValue("Benötigt Stromversorgung", microphoneType.needs_power)}
            ${this.getPropertyValue("Benötigt externes Aufnahmegerät", microphoneType.needs_recorder)}
        `
    }

    renderAudio(audioType : AudioType){
        return html`
            ${this.getPropertyValue("Stecker", audioType.connector?.name)}
        `
    }

    renderStabilizer(stabilizerType : StabilizerType){
        return html`
            ${this.getPropertyValue("Maximales Gewicht", stabilizerType.max_weight_kilograms)}
            ${this.getPropertyValue("Anzahl stabilisierter Achsen", stabilizerType.number_of_axis)}
        `
    }

    renderTripod(tripodType : TripodType){
        return html`
            ${this.getPropertyValue("Head", tripodType.head?.name)}
            ${this.getPropertyValue("Höhe (cm)", tripodType.height_centimeters)}
        `
    }

    renderSimple(simpleType: SimpleType){
        return html`
            ${this.getPropertyValue("Beschreibung", simpleType.description)}
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
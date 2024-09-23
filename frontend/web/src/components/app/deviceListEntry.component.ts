import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import {DeviceListComponent} from "./deviceList.component";
import DeviceTypeService, {
    MicrophoneType,
    CameraType,
    DeviceTypeFullDTO,
    DeviceTypeVariantEnum,
    DroneType, LensType, LightType, StabilizerType, TripodType, SimpleType, AudioType, DeviceTypeSource
} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import {model} from "../../index"
import de from "air-datepicker/locale/de"
import Util from "../../util/Util"

@customElement('cc-device-list-entry')
export class DeviceListEntryComponent extends LitElement {
    @property()
    deviceTypeFull?: DeviceTypeFullDTO

    @property()
    private appState: ObservedProperty<AppState>


    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('click', (e) => {
            let target = e.composedPath()[0] as HTMLElement

            if(target.closest("icon-cta")?.tagName != "ICON-CTA" && target.closest("button")?.tagName != "BUTTON" && this.deviceTypeFull.available > 0){
                this.toggleDeviceCheck(true)
            }
        })
    }

    render() {
        let details;
        switch(this.deviceTypeFull.deviceType.variant){
            case DeviceTypeVariantEnum.camera: details = this.renderCamera(); break;
            case DeviceTypeVariantEnum.audio: details = this.renderAudio(); break;
            case DeviceTypeVariantEnum.microphone: details = this.renderMicrophone(); break;
            case DeviceTypeVariantEnum.drone: details = this.renderDrone(); break;
            case DeviceTypeVariantEnum.lens: details = this.renderLens(); break;
            case DeviceTypeVariantEnum.light: details = this.renderLight(); break;
            case DeviceTypeVariantEnum.stabilizer: details = this.renderStabilizer(); break;
            case DeviceTypeVariantEnum.tripod: details = this.renderTripod(); break;
            case DeviceTypeVariantEnum.simple: details = this.renderSimple(); break;
        }

        return html`
            <style>${styles}</style>
            
            <h3>${this.deviceTypeFull.deviceType.name}</h3>
            ${this.deviceTypeFull.deviceTags.length != 0 ? 
                html`<div class="tags">
                    ${
                        this.deviceTypeFull.deviceTags.map(tag => {
                            return html`<cc-chip color="${ColorEnum.GRAY}" text="${tag.name}" tooltip="${tag.description}"></cc-chip>`
                        })
                    }
                </div>` : ''
            }
            ${details}
            <div class="bottom">
                <cc-chip color="${this.deviceTypeFull.available ? ColorEnum.GOOD : ColorEnum.BAD}" 
                         text="${this.deviceTypeFull.available ? (this.deviceTypeFull.available + ' Verfügbar') : 'Vergeben'}"
                ></cc-chip>
                <cc-button type="${ButtonType.OUTLINED}" .disabled="${this.deviceTypeFull.available == 0}"
                           @click="${() => model.appState.value.openCreateRentModal(this.deviceTypeFull.deviceType.type_id, "deviceType")}"
                >Verleihen</cc-button>
            </div>
            <cc-circle-select .checked="${this.appState.value.selectedDeviceEntries.has(this)}"
                              .disabled="${this.deviceTypeFull.available == 0}"
                              @click="${() => { if(this.deviceTypeFull.available > 0) this.toggleDeviceCheck() }}"
            ></cc-circle-select>
        `
    }

    renderCamera() {
        let camera = this.deviceTypeFull.deviceType as CameraType
        return html`
            <section>
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Mount" 
                            value="${camera.mount?.name}"
                           .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.mount.attribute_id)}}"
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="System" 
                            value="${camera.system?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.system.attribute_id)}}"
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Foto Resolution" 
                            value="${camera.photo_resolution?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.photo_resolution.attribute_id)}}"
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Autofokus"
                            value="${camera.autofocus ? 'Ja' : 'Nein'}"
                    ></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderAudio() {
        let audio = this.deviceTypeFull.deviceType as AudioType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Audio Connector"
                                       value="${audio.connector?.name}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderMicrophone() {
        let audio = this.deviceTypeFull.deviceType as MicrophoneType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Audio Connector"
                                       value="${audio.connector?.name}"></cc-property-value>
                    <cc-property-value size="small" property="Needs Recorder"
                                       value="${audio.needs_power}"></cc-property-value>
                    <cc-property-value size="small" property="Needs Recorder"
                                       value="${audio.needs_recorder}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderDrone() {
        let drone = this.deviceTypeFull.deviceType as DroneType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Maximale Reichweite (km)" value="${drone.max_range_kilometers}"
                                       isLink></cc-property-value>
                    <cc-property-value size="small" property="Flugzeit (min)"
                                       value="${drone.flight_time_minutes}"></cc-property-value>
                    <cc-property-value size="small" property="Benötigt Lizenz"
                                       value="${drone.requires_license ? 'Ja' : 'Nein'}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderLens() {
        let lens = this.deviceTypeFull.deviceType as LensType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Lensmount" value="${lens.lens_mount.name}"></cc-property-value>
                    <cc-property-value size="small" property="Blende" value="${lens.f_stop}"></cc-property-value>
                    <cc-property-value size="small" property="Brennweite" value="${lens.focal_length}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderLight() {
        let light = this.deviceTypeFull.deviceType as LightType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="RGB" value="${light.rgb}"></cc-property-value>
                    <cc-property-value size="small" property="Watts" value="${light.watts}"></cc-property-value>
                    <cc-property-value size="small" property="Temperatur"
                                       value="${light.variable_temperature}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderStabilizer() {
        let stabilizer = this.deviceTypeFull.deviceType as StabilizerType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Maximales Gewicht"
                                       value="${stabilizer.max_weight_kilograms}"></cc-property-value>
                    <cc-property-value size="small" property="Achsen Anzahl"
                                       value="${stabilizer.number_of_axis}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderTripod() {
        let tripod = this.deviceTypeFull.deviceType as TripodType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Head" value="${tripod.head?.name}"></cc-property-value>
                    <cc-property-value size="small" property="Höhe"
                                       value="${tripod.height_centimeters}"></cc-property-value>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderSimple() {
        let simple = this.deviceTypeFull.deviceType as SimpleType
        return html`
            <section>
                <div class="details">
                    <p>${simple.description}</p>
                </div>
                <div class="image">
                    ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                </div>
            </section>
        `
    }

    renderDeviceTypeIcon(deviceType: DeviceTypeSource){
        return html`
            <div class="image">
                ${
                    deviceType.image_blob == "" || deviceType.image_blob == null ?
                        html`<img src="../../../assets/tempCamera.png" alt="">` :
                        DeviceTypeService.deviceTypeToIcon(deviceType.variant)
                }
            </div>
        `
    }

    toggleDeviceCheck(isSimpleClick?: boolean){
        if(!isSimpleClick || this.appState.value && this.appState.value.selectedDeviceEntries.size > 0){
            if(!this.isChecked()){
                this.appState.value.addSelectedDeviceEntry(this)
            } else{
                this.appState.value.removeSelectedDeviceEntry(this)
            }
        }
    }

    isChecked(){
        return this.appState.value.selectedDeviceEntries.has(this)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list-entry": DeviceListComponent
    }
}
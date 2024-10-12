import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import {DeviceListComponent} from "./deviceList.component";
import DeviceTypeService, {
    AudioType,
    CameraType,
    DeviceTypeFullDTO,
    DeviceTypeSource,
    DeviceTypeVariantEnum,
    DroneType,
    LensType,
    LightType,
    MicrophoneType,
    SimpleType,
    StabilizerType,
    TripodType
} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import {model} from "../../index"
import Util from "../../util/Util"
import {UserRoleEnum} from "../../service/user.service"

@customElement('cc-device-list-entry')
export class DeviceListEntryComponent extends LitElement {
    @property()
    deviceTypeFull?: DeviceTypeFullDTO

    @property()
    private appState: ObservedProperty<AppState>

    @property({type: Boolean, reflect: true})
    isSelected: boolean = false

    @property({type: Boolean, reflect: true})
    isSelectable: boolean = false

    @property({type: Boolean, reflect: true})
    isListMode: boolean = false

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

        model.appState.subscribe(() => {
            this.isSelected = this.isChecked()
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

            ${ this.isListMode ? this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType) : ''}
            
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
            ${ this.isListMode ? '' : html`<cc-line></cc-line>` }
            
            <section>
                ${details}
                ${ this.isListMode ? '' : html`
                    <div class="image">
                        ${this.renderDeviceTypeIcon(this.deviceTypeFull.deviceType)}
                    </div>`
                }
            </section>
            ${ this.isListMode ? '' : html`<cc-line></cc-line>` }
            <div class="bottom">
                <cc-chip 
                    color="${this.deviceTypeFull.available > 0 ? ColorEnum.GOOD : ColorEnum.BAD}" 
                    text="${this.deviceTypeFull.available > 0 ? (this.deviceTypeFull.available + ' Verfügbar') : 'Vergeben'}"
                ></cc-chip>
                ${model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ?
                    html`
                        <cc-button type="${ButtonType.OUTLINED}" .disabled="${this.deviceTypeFull.available == 0}"
                                   @click="${() => {
                                       this.toggleDeviceCheck();
                                       model.appState.value.openCreateRentModalWithDevices(this.appState.value.selectedDeviceEntries, "type")
                                    }}"
                        >Verleihen</cc-button>
                    ` : ""
                }
            </div>
            
            ${model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ?
                html`
                    <cc-circle-select 
                        .checked="${this.appState.value.selectedDeviceEntries.has(this)}"
                        .disabled="${this.deviceTypeFull.available == 0}"
                        @click="${() => { if(this.deviceTypeFull.available > 0) this.toggleDeviceCheck() }}"
                    ></cc-circle-select>
                ` : ""
            }
        `
    }

    refreshSelectionState(){
        this.isSelected = this.isChecked()
        this.isSelectable = this.appState.value.selectedDeviceEntries.size > 0 && this.deviceTypeFull.available > 0
    }

    renderCamera() {
        let camera = this.deviceTypeFull.deviceType as CameraType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Objektiv Anschluss" 
                            value="${camera.mount?.name}"
                           .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.mount.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="System" 
                            value="${camera.system?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.system.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Foto Auflösung" 
                            value="${camera.photo_resolution?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(camera.photo_resolution.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Autofokus"
                            value="${Util.boolToYesNo(camera.autofocus)}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderAudio() {
        let audio = this.deviceTypeFull.deviceType as AudioType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Stecker"
                            value="${audio.connector?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(audio.connector.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderMicrophone() {
        let audio = this.deviceTypeFull.deviceType as MicrophoneType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Audio Connector"
                            value="${audio.connector?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(audio.connector.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Braucht Stromversorgung"
                            value="${Util.boolToYesNo(audio.needs_power)}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Braucht externes Aufnahmegerät"
                            value="${Util.boolToYesNo(audio.needs_recorder)}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderDrone() {
        let drone = this.deviceTypeFull.deviceType as DroneType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Maximale Reichweite (km)" 
                            value="${drone.max_range_kilometers}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Maximale Flugzeit (min)"
                            value="${drone.flight_time_minutes}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Benötigt Lizenz"
                            value="${Util.boolToYesNo(drone.requires_license)}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderLens() {
        let lens = this.deviceTypeFull.deviceType as LensType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Anschluss" 
                            value="${lens.mount?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(lens.mount.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Maximale Blende" 
                            value="${lens.f_stop}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Brennweite" 
                            value="${lens.focal_length}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderLight() {
        let light = this.deviceTypeFull.deviceType as LightType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="RGB Farben" 
                            value="${Util.boolToYesNo(light.rgb)}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Stärke (Watt)" 
                            value="${light.watts}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Farbtemperatur verstellbar" 
                            value="${Util.boolToYesNo(light.variable_temperature)}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderStabilizer() {
        let stabilizer = this.deviceTypeFull.deviceType as StabilizerType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Maximales Gewicht" 
                            value="${stabilizer.max_weight_kilograms}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Anzahl stabilisierter Achsen" 
                            value="${stabilizer.number_of_axis}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderTripod() {
        let tripod = this.deviceTypeFull.deviceType as TripodType
        return html`
                <div class="details">
                    <cc-property-value 
                            size="small" 
                            property="Head" 
                            value="${tripod.head?.name}"
                            .clickAction="${()=> {model.appState.value.sidebarElement.selectSecondaryFilterById(tripod.head.attribute_id)}}"
                            nowrap
                    ></cc-property-value>
                    <cc-property-value 
                            size="small" 
                            property="Höhe" 
                            value="${tripod.height_centimeters}"
                            nowrap
                    ></cc-property-value>
                </div>
        `
    }

    renderSimple() {
        let simple = this.deviceTypeFull.deviceType as SimpleType
        return html`
                <div class="details">
                    <p>${simple.description}</p>
                </div>
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
        return this.appState.value?.selectedDeviceEntries?.has(this)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list-entry": DeviceListComponent
    }
}
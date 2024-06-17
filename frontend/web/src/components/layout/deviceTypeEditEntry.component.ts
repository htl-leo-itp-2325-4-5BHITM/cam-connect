import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceTypeEditEntry.styles.scss'
import DeviceTypeService, {
    CameraType,
    DeviceType,
    DeviceTypeFullDTO,
    DeviceTypeSource, DroneType, LensType, LightType, MicrophoneType, StabilizerType, TripodType
} from "../../service/deviceType.service"
import {ColorEnum, SizeEnum} from "../../base"
import {faListUl, faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import URLHandler from "../../urlHandler"

@customElement('cc-device-type-edit-entry')
export class DeviceTypeEditEntryComponent extends LitElement {
    @property()
    deviceType: DeviceTypeFullDTO

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
                ${this.deviceType.deviceType.variant == "microphone" ? this.renderMicrophone(this.deviceType.deviceType as MicrophoneType) : ''}
                ${this.deviceType.deviceType.variant == "stabilizer" ? this.renderStabilizer(this.deviceType.deviceType as StabilizerType) : ''}
                ${this.deviceType.deviceType.variant == "tripod" ? this.renderTripod(this.deviceType.deviceType as TripodType) : ''}
            </div>

            <div class="edit">
                <div class="section" @click="${() => {URLHandler.setUrl('/app/edit/type?id=1')}}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faListUl).html[0])}
                    </div>
                    <p>Zugehörige Geräte</p>    
                </div>

                <div class="section">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </div>

                <div class="section">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    <p>Löschen</p>
                </div>
            </div>
            
            <cc-circle-select></cc-circle-select>
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }

    renderCamera(cameraType : CameraType){
        return html`
            ${this.getPropertyValue("Sensor", cameraType.sensor?.name)}
            ${this.getPropertyValue("Auflösung", cameraType.resolution?.name)}
            ${this.getPropertyValue("Autofokus", cameraType.autofocus)}
            ${this.getPropertyValue("Maximale Framerate", cameraType.framerate)}
            ${this.getPropertyValue("Mount", cameraType.mount?.name)}
            ${this.getPropertyValue("System", cameraType.system?.name)}
        `
    }

    renderDrone(droneType : DroneType) {
        return html`
            ${this.getPropertyValue("Sensor", droneType.sensor?.name)}
            ${this.getPropertyValue("Auflösung", droneType.resolution?.name)}
            ${this.getPropertyValue("Maximale Reichweite", droneType.max_range)}
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
            ${this.getPropertyValue("Needs Recorder", microphoneType.needsRecorder)}
            ${this.getPropertyValue("Wireless", microphoneType.wireless)}
            ${this.getPropertyValue("Windblocker", microphoneType.windblocker)}
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
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-edit-entry": DeviceTypeEditEntryComponent
    }
}
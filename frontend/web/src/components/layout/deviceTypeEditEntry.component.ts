import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceTypeEditEntry.styles.scss'
import DeviceTypeService, {
    CameraType,
    DeviceType,
    DeviceTypeFullDTO,
    DeviceTypeSource, DroneType, LensType, LightType, MicrophoneType, StabilizerType, TripodType
} from "../../service/deviceType.service"
import {ColorEnum} from "../../base"

@customElement('cc-device-type-edit-entry')
export class DeviceTypeEditEntryComponent extends LitElement {
    @property()
    deviceType: DeviceTypeFullDTO

    render() {
        console.log(this.deviceType)
        return html`
            <style>${styles}</style>
            
            <p>${this.deviceType.deviceType.name}</p>
            
            <div class="tags">
                ${this.deviceType.deviceTags.map(elem => {
                    return html`<cc-chip text="${elem.name}" color="${ColorEnum.GRAY}"></cc-chip>`
                })}
            </div>
            
            <div>
                ${this.deviceType.deviceType.variant == "camera" ? this.renderCamera(this.deviceType.deviceType as CameraType) : ''}
                ${this.deviceType.deviceType.variant == "drone" ? this.renderDrone(this.deviceType.deviceType as DroneType) : ''}
                ${this.deviceType.deviceType.variant == "lens" ? this.renderLens(this.deviceType.deviceType as LensType) : ''}
                ${this.deviceType.deviceType.variant == "light" ? this.renderLight(this.deviceType.deviceType as LightType) : ''}
                ${this.deviceType.deviceType.variant == "microphone" ? this.renderMicrophone(this.deviceType.deviceType as MicrophoneType) : ''}
                ${this.deviceType.deviceType.variant == "stabilizer" ? this.renderStabilizer(this.deviceType.deviceType as StabilizerType) : ''}
                ${this.deviceType.deviceType.variant == "tripod" ? this.renderTripod(this.deviceType.deviceType as TripodType) : ''}
            </div>
        `
    }

    renderCamera(cameraType : CameraType){
        return html`
            ${cameraType.sensor?.name ? html`<cc-property-value property="Sensor" value="${cameraType.sensor?.name}"></cc-property-value>` : ''}
            ${cameraType.resolution?.name ? html`<cc-property-value property="Auflösung" value="${cameraType.resolution.name}"></cc-property-value>` : ''}
            ${cameraType.autofocus ? html`<cc-property-value property="Autofokus" value="${cameraType.autofocus}"></cc-property-value>` : ''}
            ${cameraType.framerate ? html`<cc-property-value property="Maximale-Framerate" value="${cameraType.framerate}"></cc-property-value>` : ''}
            ${cameraType.mount?.name ? html`<cc-property-value property="Mount" value="${cameraType.mount.name}"></cc-property-value>` : ''}
            ${cameraType.system?.name ? html`<cc-property-value property="System" value="${cameraType.system.name}"></cc-property-value>` : ''}
        `;
    }

    renderDrone(droneType : DroneType) {
        return html`
            ${droneType.sensor?.name ? html`<cc-property-value property="Sensor" value="${droneType.sensor.name}"></cc-property-value>` : ''}
            ${droneType.resolution?.name ? html`<cc-property-value property="Auflösung" value="${droneType.resolution.name}"></cc-property-value>` : ''}
            ${droneType.max_range ? html`<cc-property-value property="Maximale Reichweite" value="${droneType.max_range}"></cc-property-value>` : ''}
        `;
    }

    renderLens(lensType : LensType){
        return html`
            ${lensType.f_stop ? html`<cc-property-value property="F Stop" value="${lensType.f_stop}"></cc-property-value>` : ''}
            ${lensType.lens_mount?.name ? html`<cc-property-value property="Lens Mount" value="${lensType.lens_mount?.name}"></cc-property-value>` : ''}
            ${lensType.focal_length ? html`<cc-property-value property="Focal Length" value="${lensType.focal_length}"></cc-property-value>` : ''}
        `
    }

    renderLight(lightType : LightType){
        return html`
            ${lightType.rgb ? html`<cc-property-value property="RGB" value="${lightType.rgb}"></cc-property-value>` : ''}
            ${lightType.variable_temperature ? html`<cc-property-value property="Variable Temperatur" value="${lightType.variable_temperature}"></cc-property-value>` : ''}
            ${lightType.watts ? html`<cc-property-value property="Watt" value="${lightType.watts}"></cc-property-value>` : ''}
        `
    }

    renderMicrophone(microphoneType : MicrophoneType){
        return html`
            ${microphoneType.needsRecorder ? html`<cc-property-value property="Needs Recorder" value="${microphoneType.needsRecorder}"></cc-property-value>` : ''}
            ${microphoneType.wireless ? html`<cc-property-value property="Wireless" value="${microphoneType.wireless}"></cc-property-value>` : ''}
            ${microphoneType.windblocker ? html`<cc-property-value property="Windblocker" value="${microphoneType.windblocker}"></cc-property-value>` : ''}
        `
    }

    renderStabilizer(stabilizerType : StabilizerType){
        return html`
            ${stabilizerType.number_of_axis ? html`<cc-property-value property="Number of axis" value="${stabilizerType.number_of_axis}"></cc-property-value>` : ''}
            ${stabilizerType.max_weight_kilograms ? html`<cc-property-value property="Max weight kilograms" value="${stabilizerType.max_weight_kilograms}"></cc-property-value>` : ''}
        `
    }

    renderTripod(tripodType : TripodType){
        return html`
            ${tripodType.head?.name ? html`<cc-property-value property="Head" value="${tripodType.head?.name}"></cc-property-value>` : ''}
            ${tripodType.height_centimeters ? html`<cc-property-value property="Höhe in Zentimeter" value="${tripodType.height_centimeters}"></cc-property-value>` : ''}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-edit-entry": DeviceTypeEditEntryComponent
    }
}
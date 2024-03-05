import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import {DeviceListComponent} from "./deviceList.component";
import {
    MicrophoneType,
    CameraType,
    DeviceTypeFullDTO,
    DeviceTypeVariantEnum,
    DroneType, LensType, LightType, StabilizerType, TripodType, SimpleType
} from "../../service/deviceType.service"

@customElement('cc-device-list-entry')
export class DeviceListEntryComponent extends LitElement {
    @property()
    deviceTypeFull?: DeviceTypeFullDTO

    render() {
        let details;
        switch(this.deviceTypeFull.deviceType.variant){
            case DeviceTypeVariantEnum.camera: details = this.renderCamera(); break;
            case DeviceTypeVariantEnum.microphone: details = this.renderAudio(); break;
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
            <div class="tags">
                ${
                        this.deviceTypeFull.deviceTags.map(tag => {
                            return html`<cc-chip color="${ColorEnum.GRAY}" text="${tag.description}"></cc-chip>`
                        })
                }
            </div>
            ${details}
            <div class="bottom">
                <cc-chip color="${ColorEnum.GOOD}" text="${this.deviceTypeFull.available} Verfügbar"></cc-chip>
                <cc-button type="${ButtonType.OUTLINED}">Verleihen</cc-button>
            </div>
            <cc-circle-select></cc-circle-select>
        `
    }

    renderCamera() {
        let camera = this.deviceTypeFull.deviceType as CameraType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="System" value="${camera.system.name}"></cc-property-value>
                    <cc-property-value size="small" property="Sensor" value="${camera.sensor}" isLink></cc-property-value>
                    <cc-property-value size="small" property="Auflösung" value="${camera.resolution.name}"></cc-property-value>
                    <cc-property-value size="small" property="Maximale-Framerate" value="${camera.framerate}fps"></cc-property-value>
                    <cc-property-value size="small" property="Mount" value="${camera.mount}" isLink></cc-property-value>
                    <cc-property-value size="small" property="Autofokus" value="${camera.autofocus ? 'Ja' : 'Nein'}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderAudio() {
        let audio = this.deviceTypeFull.deviceType as MicrophoneType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Needs Recorder" value="${audio.needsRecorder}"></cc-property-value>
                    <cc-property-value size="small" property="Windblocker" value="${audio.windblocker}"></cc-property-value>
                    <cc-property-value size="small" property="Wireless" value="${audio.wireless}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderDrone() {
        let drone = this.deviceTypeFull.deviceType as DroneType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Sensor" value="${drone.sensor}"></cc-property-value>
                    <cc-property-value size="small" property="Auflösung" value="${drone.resolution}"></cc-property-value>
                    <cc-property-value size="small" property="Maximale Reichweite" value="${drone.max_range}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderLens() {
        let lens = this.deviceTypeFull.deviceType as LensType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Lensmount" value="${lens.lens_mount}"></cc-property-value>
                    <cc-property-value size="small" property="Blende" value="${lens.f_stop}"></cc-property-value>
                    <cc-property-value size="small" property="Brennweite" value="${lens.focal_length}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
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
                    <cc-property-value size="small" property="Temperatur" value="${light.variable_temperature}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderStabilizer() {
        let stabilizer = this.deviceTypeFull.deviceType as StabilizerType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Maximales Gewicht" value="${stabilizer.max_weight}"></cc-property-value>
                    <cc-property-value size="small" property="Achsen Anzahl" value="${stabilizer.number_of_axis}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderTripod() {
        let tripod = this.deviceTypeFull.deviceType as TripodType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Head" value="${tripod.head}"></cc-property-value>
                    <cc-property-value size="small" property="Höhe" value="${tripod.height}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }

    renderSimple() {
        let simple = this.deviceTypeFull.deviceType as SimpleType
        return html`
            <section>
                <div class="details">
                    <cc-property-value size="small" property="Beschreibung" value="${simple.description}"></cc-property-value>
                </div>
                <div class="image">
                    <img src="../../../assets/tempCamera.png" alt="">
                </div>
            </section>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list-entry": DeviceListComponent
    }
}
import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import {DeviceListComponent} from "./deviceList.component";
import {Device} from "../../service/device.service"
import {CameraType, DeviceType, DeviceTypeVariantEnum} from "../../service/deviceType.service"

@customElement('cc-device-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    deviceType?: DeviceType

    render() {
        switch(this.deviceType.variant){
            case DeviceTypeVariantEnum.camera: return this.renderCamera()
        }
    }

    renderCamera() {
        let camera = this.deviceType as CameraType
        return html`
            <style>${styles}</style>
            <h3>${camera.name}</h3>
            <div class="tags">
                <cc-chip color="${ColorEnum.GRAY}">Kamera</cc-chip>
                <cc-chip color="${ColorEnum.GRAY}">Foto</cc-chip>
                <cc-chip color="${ColorEnum.GRAY}">Video</cc-chip>
                <cc-chip color="${ColorEnum.GRAY}">Slow-Mo</cc-chip>
                <cc-chip color="${ColorEnum.GRAY}">4te Klasse</cc-chip>
                <cc-chip color="${ColorEnum.GRAY}">5te Klasse</cc-chip>
            </div>
            
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
            
            <div class="bottom">
                <cc-chip color="${ColorEnum.GOOD}">7 Verfügbar</cc-chip>
                <cc-button type="${ButtonType.OUTLINED}">Verleihen</cc-button>
            </div>
            
            <cc-circle-select></cc-circle-select>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list-entry": DeviceListComponent
    }
}
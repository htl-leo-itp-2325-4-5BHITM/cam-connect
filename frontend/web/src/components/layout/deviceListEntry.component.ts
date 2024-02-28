import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import {DeviceListComponent} from "./deviceList.component";
import {Device} from "../../service/device.service"
import {CameraType, DeviceType, DeviceTypeFullDTO, DeviceTypeVariantEnum} from "../../service/deviceType.service"

@customElement('cc-device-list-entry')
export class DeviceListEntryComponent extends LitElement {
    @property()
    deviceTypeFull?: DeviceTypeFullDTO

    render() {
        console.log(this.deviceTypeFull)
        switch(this.deviceTypeFull.deviceType.variant){
            case DeviceTypeVariantEnum.camera: return this.renderCamera()
        }
    }

    renderCamera() {
        console.log(this.deviceTypeFull.available)
        let camera = this.deviceTypeFull.deviceType as CameraType
        return html`
            <style>${styles}</style>
            <h3>${camera.name}</h3>
            <div class="tags">
                ${
                    this.deviceTypeFull.deviceTags.map(tag => {
                        return html`<cc-chip color="${ColorEnum.GRAY}" text="${tag.description}"></cc-chip>`
                    })
                }
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
                <cc-chip color="${ColorEnum.GOOD}" text="${this.deviceTypeFull.available} Verfügbar"></cc-chip>
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
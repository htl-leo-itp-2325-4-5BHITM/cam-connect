import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceListEntry.styles.scss'
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"
import {ChipSize} from "../basic/chip.component";
import {model} from "../../index";
import {DeviceListComponent} from "./deviceList.component";
import {PropertyValueSize} from "../basic/propertyValue.component";

@customElement('cc-device-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    deviceNumber?: number

    render() {
        let device = model.devices.value[this.deviceNumber]
        console.log(device)

        return html`
            <style>${styles}</style>
            <h3>${device.type.name}</h3>
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
                    <cc-property-value property="Sensor" value="Full-Frame" isLink></cc-property-value>
                    <cc-property-value property="Auflösung" value="4k Video, 5k Foto"></cc-property-value>
                    <cc-property-value property="Maximale-Framerate" value="185fps"></cc-property-value>
                    <cc-property-value property="Mount" value="L-Mount" isLink></cc-property-value>
                    <cc-property-value property="Autofokus" value="Ja"></cc-property-value>
                </div>
                <div>
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
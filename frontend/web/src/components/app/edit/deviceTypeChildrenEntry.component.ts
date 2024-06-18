import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEditEntry.styles.scss'
import {Device} from "../../../service/device.service"
import {SizeEnum} from "../../../base"

@customElement('cc-device-type-children-entry')
export class DeviceTypeChildrenEntryComponent extends LitElement {
    @property()
    device: Device

    render() {
        return html`
            <style>${styles}</style>
            
            <h3>${this.device.number}</h3>

            <div class="deviceInfos">
                ${this.getPropertyValue("Seriennummer", this.device.serial)}
                ${this.getPropertyValue("Erstellt am", this.device.creation_date)}
                ${this.getPropertyValue("Bearbeitet am", this.device.change_date)}
                ${this.getPropertyValue("Notiz", this.device.note)}
            </div>
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-children-entry": DeviceTypeChildrenEntryComponent
    }
}
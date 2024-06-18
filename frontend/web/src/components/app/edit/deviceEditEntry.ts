import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceEditEntry.styles.scss'
import {ColorEnum, SizeEnum} from "../../../base"
import {Device} from "../../../service/device.service"

@customElement('cc-device-edit-entry')
export class DeviceEditEntryComponent extends LitElement {
    @property()
    device: Device

    render() {
        return html`
            <style>${styles}</style>
            
            
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-edit-entry": DeviceEditEntryComponent
    }
}
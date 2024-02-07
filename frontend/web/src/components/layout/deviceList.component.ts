import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import {model} from "../../index";

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    render() {
        let count = 0;

        return html`
            <style>${styles}</style>
            
            ${model.devices.value.map(device => {
                return this.generateStudent(count++)
            })}
        `
    }

    generateStudent(count: number){
        return html`
            <cc-device-list-entry deviceNumber="${count}"></cc-device-list-entry>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list": DeviceListComponent
    }
}
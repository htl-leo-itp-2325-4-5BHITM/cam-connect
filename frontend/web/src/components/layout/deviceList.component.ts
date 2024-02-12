import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"

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

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1000, key: "large"}, {size: 1200, key: "xLarge"}])
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
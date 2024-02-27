import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"
import {ObservedProperty} from "../../model"
import {Device} from "../../service/device.service"
import {RentByStudentDTO} from "../../service/rent.service"

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    @property()
    private devices: ObservedProperty<Device[]>

    constructor() {
        super()
        this.devices = new ObservedProperty<Device[]>(this, model.devices)
    }
    render() {
        let count = 0;

        return html`
            <style>${styles}</style>
            
            ${this.devices.value.map(device => {
                return this.generateStudent(count++)
            })}
        `
    }

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1200, key: "large"}, {size: 1400, key: "xLarge"}])
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
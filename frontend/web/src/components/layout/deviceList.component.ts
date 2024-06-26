import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"
import {ObservedProperty} from "../../model"
import {Device} from "../../service/device.service"
import {RentByStudentDTO} from "../../service/rent.service"
import {DeviceType, DeviceTypeFullDTO, DeviceTypeVariantCollection} from "../../service/deviceType.service"

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    @property()
    private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>

    constructor() {
        super()
        this.deviceTypesFull = new ObservedProperty<DeviceTypeFullDTO[]>(this, model.deviceTypesFull)
    }
    render() {
        return html`
            <style>${styles}</style>

            <div class="content">
                ${Object.values(this.deviceTypesFull.value).flat().map(deviceType => {
                    return html`<cc-device-list-entry .deviceTypeFull="${deviceType}"></cc-device-list-entry>`
                })}
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1000, key: "large"}, {size: 1600, key: "xLarge"}])
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list": DeviceListComponent
    }
}
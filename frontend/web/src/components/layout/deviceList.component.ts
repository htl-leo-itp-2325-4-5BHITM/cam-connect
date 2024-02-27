import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"
import {ObservedProperty} from "../../model"
import {Device} from "../../service/device.service"
import {RentByStudentDTO} from "../../service/rent.service"
import {DeviceType, DeviceTypeVariantCollection} from "../../service/deviceType.service"

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    @property()
    private deviceTypes: ObservedProperty<DeviceTypeVariantCollection>

    constructor() {
        super()
        this.deviceTypes = new ObservedProperty<DeviceTypeVariantCollection>(this, model.deviceTypes)
    }
    render() {
        let deviceTypes = Object.values(this.deviceTypes.value).flat()

        return html`
            <style>${styles}</style>

            ${deviceTypes.map(deviceType => {
                return html`<cc-device-list-entry .deviceType="${deviceType}"></cc-device-list-entry>`
            })}
        `
    }

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1200, key: "large"}, {size: 1400, key: "xLarge"}])
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list": DeviceListComponent
    }
}
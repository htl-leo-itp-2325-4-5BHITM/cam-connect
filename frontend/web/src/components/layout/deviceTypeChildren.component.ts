import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceTypeChildren.styles.scss'
import {
    DeviceTypeFullDTO,
} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import {model} from "../../index"

@customElement('cc-device-type-children')
export class DeviceTypeChildrenComponent extends LitElement {
    @property() deviceType: DeviceTypeFullDTO

    @property() appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        console.log("test")
        console.log(this.deviceType)
        return html`
            <style>${styles}</style>
            <h1>${this.deviceType.deviceType.name}</h1>
            <p>Zugehörige Geräte</p>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-children": DeviceTypeChildrenComponent
    }
}
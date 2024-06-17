import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceTypeEdit.styles.scss'
import {
    DeviceTypeFullDTO,
} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import {model} from "../../index"

@customElement('cc-device-type-edit')
export class DeviceTypeEditComponent extends LitElement {
    @property() deviceType: DeviceTypeFullDTO

    @property() appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-entry": DeviceTypeEditComponent
    }
}
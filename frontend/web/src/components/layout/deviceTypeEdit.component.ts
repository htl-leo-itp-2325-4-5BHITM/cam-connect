import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceTypeEdit.styles.scss'
import {
    DeviceTypeFullDTO, DeviceTypeVariantEnum,
} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import URLHandler from "../../urlHandler"
import {model} from "../../index"
import {AppState} from "../../AppState"

@customElement('cc-device-type-edit')
export class DeviceTypeEditComponent extends LitElement {
    @property() private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>

    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.deviceTypesFull = new ObservedProperty<DeviceTypeFullDTO[]>(this, model.deviceTypesFull)
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>

            <div class="toolbar-container">
                <cc-toolbar></cc-toolbar>

                <main>
                    <h1>Kamera-Gerätetypen</h1>

                    ${Object.values(this.deviceTypesFull.value)?.flat().map(deviceType => {
                        if(deviceType.deviceType.variant == this.appState.value.editPageType){
                            return html`<cc-device-type-edit-entry .deviceType="${deviceType}"></cc-device-type-edit-entry>`
                        }
                    })}
                </main>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-edit": DeviceTypeEditComponent
    }
}
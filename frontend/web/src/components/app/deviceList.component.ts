import {LitElement, css, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"
import {ObservedProperty} from "../../model"
import {DeviceType, DeviceTypeFullDTO, DeviceTypeVariantCollection} from "../../service/deviceType.service"
import {AppState} from "../../AppState"

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
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

            <div class="content ${model.appState.value.equipmentDisplayMode}">
                ${Object.values(this.deviceTypesFull.value)?.flat().sort((a, b)=>  (a.deviceType.name)?.localeCompare(b.deviceType.name))?.map(deviceType => {
                    return html`
                        <cc-device-list-entry 
                            .deviceTypeFull="${deviceType}"
                            .isSelectable="${this.appState.value.selectedDeviceEntries.size > 0 && deviceType.available > 0}"
                            .isListMode="${this.appState.value.equipmentDisplayMode == 'list'}"
                        ></cc-device-list-entry>
                    `
                })}

                ${this.deviceTypesFull.value.length == 0 ? html`<p class="noResults">Keine Ergebnisse gefunden</p>` : ""}
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1000, key: "large"}, {size: 1600, key: "xLarge"}])
    }

    updated(changedProperties: PropertyValues) {
        this.shadowRoot.querySelectorAll("cc-device-list-entry[isselectable]").forEach((entry: any) => {
            entry.refreshSelectionState()
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list": DeviceListComponent
    }
}
import {LitElement, css, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/deviceList.styles.scss'
import {model} from "../../index";
import {WidthResizeObserver} from "../../base"
import {ObservedProperty} from "../../model"
import {DeviceType, DeviceTypeFullDTO, DeviceTypeVariantCollection} from "../../service/deviceType.service"
import {AppState} from "../../AppState"
import {DeviceSetFullDTO} from "../../service/deviceSet.service"

export interface MergedEquipment {
    deviceTypeFull: DeviceTypeFullDTO
    deviceSetFull: DeviceSetFullDTO
    variant: "deviceType" | "deviceSet"
}

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    @property() private mergedDeviceTypes: MergedEquipment[] = []

    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()

        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        model.deviceTypesFull.subscribe(types => {this.processEquipment()})

        model.deviceSetsFull.subscribe(sets => {this.processEquipment()})

        super.firstUpdated(_changedProperties);
    }

    processEquipment(){
        this.mergedDeviceTypes = []
        model.deviceTypesFull.value?.forEach(types =>{
            this.mergedDeviceTypes.push({deviceTypeFull: types, deviceSetFull: null, variant: "deviceType"} as MergedEquipment)
        })

        model.deviceSetsFull.value?.forEach(set =>{
            this.mergedDeviceTypes.push({deviceTypeFull: null, deviceSetFull: set, variant: "deviceSet"} as MergedEquipment)
        })
    }

    render() {
        return html`
            <style>${styles}</style>

            <div class="content ${model.appState.value.equipmentDisplayMode}">
                ${Object.values(this.mergedDeviceTypes)?.flat().map(elem => {
                    if(elem.variant == "deviceType" && this.appState.value.deviceTypeOrSet == "type") {
                        return html`
                            <cc-device-list-entry
                                .deviceTypeFull="${elem.deviceTypeFull}"
                                .isSelectable="${this.appState.value.selectedDeviceEntries.size + this.appState.value.selectedSetEntries.size > 0 && elem.deviceTypeFull.available > 0}"
                                .isListMode="${this.appState.value.equipmentDisplayMode == 'list'}"
                            ></cc-device-list-entry>
                        `
                    } else if(elem.variant == "deviceSet" && this.appState.value.deviceTypeOrSet == "set"){
                        return html`
                        <cc-device-set-list-entry
                            .deviceSet="${elem.deviceSetFull}"
                            .isSelectable="${this.appState.value.selectedSetEntries.size + this.appState.value.selectedDeviceEntries.size > 0 && elem.deviceSetFull.available > 0}"
                            .isListMode="${this.appState.value.equipmentDisplayMode == 'list'}"
                        ></cc-device-set-list-entry>
                    `
                    }

                })}

                ${this.mergedDeviceTypes.length == 0 ? html`<p class="noResults">Keine Ergebnisse gefunden</p>` : ""}
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        new WidthResizeObserver(this, [{size: 0, key: "small"}, {size: 600, key: "medium"}, {size: 1000, key: "large"}, {size: 1600, key: "xLarge"}]);
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
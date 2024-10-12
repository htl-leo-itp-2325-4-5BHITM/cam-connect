import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEdit.styles.scss'
import {
    DeviceTypeFullDTO, DeviceTypeVariantEnum,
} from "../../../service/deviceType.service"
import {EditPageEnum, ObservedProperty} from "../../../model"
import UrlHandler from "../../../util/UrlHandler"
import {model} from "../../../index"
import {AppState} from "../../../AppState"
import {InputType} from "../../basic/input.component"
import {ColorEnum, SizeEnum} from "../../../base"
import TagService, {Tag} from "../../../service/tag.service"
import {ChipType} from "../../basic/chip.component"
import {DeviceSetCreateDTO, DeviceSet} from "../../../service/deviceSet.service"

@customElement('cc-device-set-edit')
export class DeviceSetEditComponent extends LitElement {
    @property() private deviceSets: ObservedProperty<DeviceSet[]>

    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.deviceSets = new ObservedProperty<DeviceSet[]>(this, model.deviceSets)
        this.appState = new ObservedProperty<AppState>(this, model.appState)

        console.log(this.deviceSets.value)
    }

    render() {
        return html`
            <style>${styles}</style>

            <div class="toolbar-container">
                <cc-toolbar type="edit"></cc-toolbar>

                <main>
                    <div class="header">
                        <h1>
                            Geräte-Sets
                        </h1>
                    </div>
                    
                    ${Object.values(this.deviceSets.value)?.flat().map(deviceSet => {
                        return html`<cc-device-set-edit-entry .deviceSet="${deviceSet}" @click="${() => {
                            let convertedDeviceSet : DeviceSetCreateDTO = {
                                id: deviceSet.id,
                                name: deviceSet.name,
                                description: deviceSet.description,
                                deviceTypeIds: deviceSet.device_types.map(deviceType => deviceType.type_id) || [],
                                status: deviceSet.status,
                                tags: deviceSet.tags
                            } as DeviceSetCreateDTO
                            
                            model.appState.value.openOverlay(html`<cc-edit-device-set-modal .element="${convertedDeviceSet}" .isEditMode="${true}" .elementId="${deviceSet.id}"></cc-edit-device-set-modal>`, () => {})}}">
                        }}"></cc-device-set-edit-entry>`
                    })}
                </main>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-set-edit": DeviceSetEditComponent
    }
}
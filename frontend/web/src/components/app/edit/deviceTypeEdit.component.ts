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
                <cc-toolbar type="edit"></cc-toolbar>

                <main>
                    <div class="header">
                        <h1>
                            ${model.deviceTypeNameFilterOptions.getValue().find(value => value.id == this.appState.value.editPageType)?.name}-Gerätetypen
                        </h1>
                    </div>
                    
                    ${Object.values(this.deviceTypesFull.value)?.flat().map(deviceType => {
                        if(deviceType.deviceType.variant == this.appState.value.editPageType){
                            return html`<cc-device-type-edit-entry .deviceType="${deviceType}" @click="${() => {
                                model.appState.value.openOverlay(html`<cc-edit-device-type-modal .element="${deviceType}" .isEditMode="${true}"></cc-edit-device-type-modal>`, () => {})}}">
                            }}"></cc-device-type-edit-entry>`
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
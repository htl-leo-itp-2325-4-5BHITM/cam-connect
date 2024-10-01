import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEditEntry.styles.scss'
import {ColorEnum, Orientation, SizeEnum} from "../../../base"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import PopupEngine from "../../../util/PopupEngine"
import DeviceSetService, {DeviceSet} from "../../../service/deviceSet.service"

@customElement('cc-device-set-edit-entry')
export class DeviceSetEditEntryComponent extends LitElement {
    @property() deviceSet: DeviceSet

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <h3 class="children">${this.deviceSet.name}</h3>
            
            <!-- todo für yanik <cc-line type="${Orientation.VERTICAL}"></cc-line>-->

            <div class="tags">
                
            </div>

            <div class="deviceSetInfo">
                ${
                    this.deviceSet.device_types?.map((deviceType, index) => {
                        return html`<span>${deviceType.name} ${this.deviceSet.device_types.length - 1 <= index ? '' : ','}</span>`
                    })
                }
            </div>
            
            <div class="edit">
                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"  @click="${(event) => {
                    //UrlHandler.updateUrl('/app/edit/device?did=' + this.device.device_id)
                    model.appState.value.openOverlay(html`<cc-edit-device-set-modal .element="${this.deviceSet}" .isEditMode="${true}"></cc-edit-device-set-modal>`, () => {})
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${(event) => {
                    this.removeDevice(this.deviceSet)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    <p>Löschen</p>
                </cc-button>
            </div>

            <cc-circle-select .checked="${this.appState.value.selectedDeviceSetEditEntries.has(this)}"
                              @click="${(event) => {
                                  model.appState.value.toggleSelectedDeviceSetEditEntry(this);
                                  event.stopPropagation();
                              }}">
            </cc-circle-select>
        `
    }

    private removeDevice(device: DeviceSet) {
        PopupEngine.createModal({
            text: `Möchten Sie das Geräte-Set ${device.name} wirklich löschen?`,
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        DeviceSetService.remove(device)
                        this.appState.value.clearSelectedDeviceTypeEditEntries()
                        this.appState.value.clearSelectedDeviceEditEntries()
                        this.appState.value.clearSelectedDeviceSetEditEntries()
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-set-edit-entry": DeviceSetEditEntryComponent
    }
}
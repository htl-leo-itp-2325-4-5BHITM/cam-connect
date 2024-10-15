import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEditEntry.styles.scss'
import DeviceService, {Device} from "../../../service/device.service"
import {ColorEnum, Orientation, SizeEnum} from "../../../base"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import UrlHandler from "../../../util/UrlHandler"
import {EditComponent} from "./edit.component"
import PopupEngine from "../../../util/PopupEngine"
import DeviceTypeService from "../../../service/deviceType.service"
import Util from "../../../util/Util"

@customElement('cc-device-type-children-entry')
export class DeviceTypeChildrenEntryComponent extends LitElement {
    @property() device: Device

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        console.log(this.device)
        return html`
            <style>${styles}</style>
            
            <h3 class="children">${this.device.number}</h3>
            
            <!-- todo für yanik <cc-line type="${Orientation.VERTICAL}"></cc-line>-->

            <div class="deviceInfos">
                ${this.getPropertyValue("Seriennummer", this.device.serial)}
                ${this.getPropertyValue("Erstellt am", Util.formatLongDateForHuman(this.device.creation_date) || '-')}
                ${this.getPropertyValue("Bearbeitet am", Util.formatLongDateForHuman(this.device.change_date) || '-')}
                ${this.getPropertyValue("Notiz", this.device.note)}
            </div>
            
            <div class="edit">
                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"  @click="${(event) => {
                    //UrlHandler.updateUrl('/app/edit/device?did=' + this.device.device_id)
                    (model.appState.value.originElement as EditComponent).showModal(this.device, true, EditPageEnum.DEVICE)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </cc-button>

                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}" @click="${(event) => {
                    this.removeDevice(this.device)
                    event.stopPropagation()
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    <p>Löschen</p>
                </cc-button>
            </div>
            
            <cc-circle-select .checked="${this.appState.value.selectedDeviceEditEntries.has(this)}"
                              @click="${(event) => {model.appState.value.toggleSelectedDeviceEditEntry(this); event.stopPropagation()}}">
            </cc-circle-select>
        `
    }

    getPropertyValue(property: string, value: any){
        if(value && value != "") return html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>`
        return html``
    }

    private removeDevice(device: Device) {
        PopupEngine.createModal({
            text: `Möchten Sie das Gerät ${device.number} wirklich löschen?`,
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        DeviceService.remove(device)
                        this.appState.value.clearSelectedDeviceTypeEditEntries()
                        this.appState.value.clearSelectedDeviceEditEntries()
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
        "cc-device-type-children-entry": DeviceTypeChildrenEntryComponent
    }
}
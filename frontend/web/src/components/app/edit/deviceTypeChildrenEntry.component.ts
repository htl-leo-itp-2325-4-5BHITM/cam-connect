import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEditEntry.styles.scss'
import {Device} from "../../../service/device.service"
import {ColorEnum, SizeEnum} from "../../../base"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faPen} from "@fortawesome/free-solid-svg-icons"
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import UrlHandler from "../../../util/UrlHandler"
import {EditComponent} from "./edit.component"

@customElement('cc-device-type-children-entry')
export class DeviceTypeChildrenEntryComponent extends LitElement {
    @property() device: Device

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <h3 class="children">${this.device.number}</h3>

            <div class="deviceInfos">
                ${this.getPropertyValue("Seriennummer", this.device.serial)}
                ${this.getPropertyValue("Erstellt am", this.device.creation_date)}
                ${this.getPropertyValue("Bearbeitet am", this.device.change_date)}
                ${this.getPropertyValue("Notiz", this.device.note)}
            </div>
            
            <div class="edit">
                <cc-button type="text" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}"  @click="${() => {
                    //UrlHandler.updateUrl('/app/edit/device?did=' + this.device.device_id)
                    (model.appState.value.originElement as EditComponent).showModal(this.device, "update", EditPageEnum.DEVICE)
                }}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faPen).html[0])}
                    </div>
                    <p>Bearbeiten</p>
                </cc-button>
            </div>
            
            <cc-circle-select></cc-circle-select>
        `
    }

    getPropertyValue(property: string, value: any){
        return html`${value ? html`<cc-property-value property="${property}" value="${value}" size="${SizeEnum.SMALL}"></cc-property-value>` : ''}`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-children-entry": DeviceTypeChildrenEntryComponent
    }
}
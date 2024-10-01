import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEdit.styles.scss'
import {
    DeviceTypeFullDTO,
} from "../../../service/deviceType.service"
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import {faArrowLeft, faEdit, faPlus} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import UrlHandler from "../../../util/UrlHandler"
import {Device} from "../../../service/device.service"

@customElement('cc-device-type-children')
export class DeviceTypeChildrenComponent extends LitElement {
    @property() deviceType: DeviceTypeFullDTO

    @property() private appState: ObservedProperty<AppState>

    @property() private devices: ObservedProperty<Device[]>

    constructor(){
        super()
        this.devices = new ObservedProperty<Device[]>(this, model.devices)
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>

            <div class="toolbar-container">
                <cc-toolbar type="edit"></cc-toolbar>

                <main>
                    <div class="header">
                        <div class="left">
                            <icon-cta size="3rem" @click="${() => {
                                UrlHandler.setUrl(`/app/edit?type=${this.deviceType.deviceType.variant}`)}}">${unsafeSVG(icon(faArrowLeft).html[0])}
                            </icon-cta>

                            <div @click="${() => {
                                model.appState.value.openOverlay(
                                        html`<cc-edit-device-type-modal .element="${this.deviceType}" .isEditMode="${true}"></cc-edit-device-type-modal>`,
                                        () => {}
                                )
                            }}" class="deviceTypeHeading">
                                <div class="deviceTypeName">
                                    <h1>${this.deviceType.deviceType.name}</h1>
                                    ${unsafeSVG(icon(faEdit).html[0])}</icon-cta>
                                </div>
                                <p>Zugehörige Geräte</p>
                            </div>
                        </div>
                        
                        <div class="right">
                            <icon-cta size="3rem" @click="${() => {
                                model.appState.value.openOverlay(html`<cc-edit-device-modal .deviceType="${this.deviceType}" .isEditMode="${false}"></cc-edit-device-modal>`, () => {})}}">

                                ${unsafeSVG(icon(faPlus).html[0])}
                            </icon-cta>
                        </div>
                    </div>
                    
                    ${this.devices.value.map(device => {
                        if(device.type.type_id == this.deviceType.deviceType.type_id){
                            return html`
                                <cc-device-type-children-entry @click="${() => {
                                    model.appState.value.openOverlay(html`<cc-edit-device-modal .element="${device}" .deviceType="${this.deviceType}" .isEditMode="${true}"></cc-edit-device-modal>`, () => {})}
                                }" .device="${device}"></cc-device-type-children-entry>
                            `
                        }
                    })}
                </main>
            </div>

        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-type-children": DeviceTypeChildrenComponent
    }
}
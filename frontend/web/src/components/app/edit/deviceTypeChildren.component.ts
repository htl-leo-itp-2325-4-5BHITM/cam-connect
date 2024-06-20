import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../../styles/components/app/edit/deviceTypeEdit.styles.scss'
import {
    DeviceTypeFullDTO,
} from "../../../service/deviceType.service"
import {ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {model} from "../../../index"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import UrlHandler from "../../../util/UrlHandler"

@customElement('cc-device-type-children')
export class DeviceTypeChildrenComponent extends LitElement {
    @property() deviceType: DeviceTypeFullDTO

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>

            <div class="toolbar-container">
                <cc-toolbar type="edit"></cc-toolbar>

                <main>
                    <div>
                        <icon-cta @click="${() => {UrlHandler.setUrl('/app/edit?type=' + this.appState.value.editPageType)}}">${unsafeSVG(icon(faArrowLeft).html[0])}</icon-cta>
                        
                        <div>
                            <h1>${this.deviceType.deviceType.name}</h1>
                            <p>Zugehörige Geräte</p>
                        </div>
                    </div>
                    
                    ${model.devices.value.map(device => {
                        if(device.type.type_id == this.deviceType.deviceType.type_id){
                            return html`
                                <cc-device-type-children-entry .device="${device}"></cc-device-type-children-entry>
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
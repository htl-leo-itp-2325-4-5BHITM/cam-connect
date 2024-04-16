import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/edit.styles.scss'
import URLHandler from "../urlHandler"
import DeviceTypeAttributeService from "../service/deviceTypeAttribute.service"
@customElement('cc-edit')
export class EditComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            
            <label for="cameraType">CameraType: </label>
            <input type="file" id="cameraType" accept=".csv"/>

            <label for="droneType">DroneType: </label>
            <input type="file" id="droneType" accept=".csv"/>

            <label for="lensType">LensType: </label>
            <input type="file" id="lensType" accept=".csv"/>

            <label for="lightType">LightType: </label>
            <input type="file" id="lightType" accept=".csv"/>

            <label for="microphoneType">MicrophoneType: </label>
            <input type="file" id="microphoneType" accept=".csv"/>

            <label for="simpleType">SimpleType: </label>
            <input type="file" id="simpleType" accept=".csv"/>

            <label for="stabilizerType">StabilizerType: </label>
            <input type="file" id="stabilizerType" accept=".csv"/>

            <label for="tripodType">TripodType: </label>
            <input type="file" id="tripodType" accept=".csv"/>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit": EditComponent
    }
}
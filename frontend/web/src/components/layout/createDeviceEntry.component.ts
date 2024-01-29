import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createDeviceEntry.styles.scss'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons"

@customElement('cc-create-device-entry')
export class CreateDeviceEntryComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            
            <div>
                <input type="text" value="Lumix s5ii">
                <input type="text" value="24" class="number">
            </div>
            
            <div>
                <input type="date">
                <label for="" class="line">-</label>
                <input type="date">
            </div>

            <icon-cta>${unsafeSVG(icon(faMagnifyingGlass).html[0])}</icon-cta>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-device-entry": CreateDeviceEntryComponent
    }
}
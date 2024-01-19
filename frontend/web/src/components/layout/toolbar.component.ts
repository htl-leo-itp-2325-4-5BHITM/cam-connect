import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash, faCamera } from "@fortawesome/free-solid-svg-icons"
import {ObservedProperty, Pages} from "../../model"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {
    //todo bind with global variable of navigation location
    @property()
    page?: ObservedProperty<Pages>

    render() {
        switch (this.page.value) {
            case Pages.EQUIPMENT: return this.renderEquipmentBar(); break;
            case Pages.RENTS: return this.renderRentListBar(); break;
        }
    }

    renderRentListBar(){
        return html`
            <style>${styles}</style>
            <div>
                <img src="../../../assets/icon/select_circle.svg">
                Auswahlaufheben
            </div>
            <div>
                ${unsafeSVG(icon(faTrash).html[0])}
                Löschen
            </div>
            <div>
                <img src="../../../assets/icon/return.svg">
                Zurückgeben
            </div>
        `
    }

    renderEquipmentBar() {
        return html`
            <style>${styles}</style>
            <div>
                <div>
                    <img src="../../../assets/icon/circle-plus.svg"/>
                    Gerät(e)hinzufügen
                </div>
                <div>
                    ${unsafeSVG(icon(faCamera).html[0])}
                    Gerätetyphinzufügen
                </div>
            </div>
            
            <div>
                <div>
                    <cc-circle-select></cc-circle-select>
                    Auswahlaufheben
                </div>
                <div>
                    ${unsafeSVG(icon(faTrash).html[0])}
                    Gerät(e)löschen
                </div> 
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-toolbar": ToolbarComponent
    }
}
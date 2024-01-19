import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {
    //todo bind with global variable of navigation location
    render() {
        return this.renderRentListBar()
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
                ${unsafeSVG(icon(faTrash).html[0])}
                Auswahl aufheben
            </div>
            <div>
                ${unsafeSVG(icon(faTrash).html[0])}
                Löschen
            </div>
            <div>
                ${unsafeSVG(icon(faTrash).html[0])}
                Zurückgeben
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-toolbar": ToolbarComponent
    }
}
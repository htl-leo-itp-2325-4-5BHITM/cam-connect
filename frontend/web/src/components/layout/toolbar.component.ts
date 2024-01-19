import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash, faCamera } from "@fortawesome/free-solid-svg-icons"
import {ObservedProperty, Pages} from "../../model"
import {ButtonColor, ButtonSize, ButtonType} from "../basic/button.component"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {
    @property()
    page?: ObservedProperty<Pages>

    render() {
        switch (this.page.value) {
            case Pages.EQUIPMENT: return this.renderEquipmentBar();
            case Pages.RENTS: return this.renderRentListBar();
        }
    }

    renderRentListBar(){
        return html`
            <style>${styles}</style>
            <div class="main rentlist">
                <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                    <img slot="left" src="../../../assets/icon/select_circle.svg">
                    Auswahlaufheben
                </cc-button>
                
                <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left">${unsafeSVG(icon(faTrash).html[0])}</div>
                    Löschen
                </cc-button>
    
                <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                    <img slot="left" src="../../../assets/icon/return.svg">
                    Zurückgeben
                </cc-button>
            </div>
        `
    }

    renderEquipmentBar() {
        return html`
            <style>${styles}</style>
            <div class="main equipment">
                <div>
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <img slot="left" src="../../../assets/icon/circle-plus.svg"/>
                        Gerät(e)hinzufügen
                    </cc-button>
    
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left">${unsafeSVG(icon(faCamera).html[0])}</div>
                        Gerätetyp hinzufügen
                    </cc-button>
                </div>
                
                <div>
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <cc-circle-select slot="left"></cc-circle-select>
                        Auswahl aufheben
                    </cc-button>
    
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left">${unsafeSVG(icon(faTrash).html[0])}</div>
                        Gerät(e) löschen
                    </cc-button>
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
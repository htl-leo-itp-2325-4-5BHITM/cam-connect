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
                    <div slot="left" class="icon accent">
                        <img slot="left" src="../../../assets/icon/select_circle.svg">
                    </div>
                    Auswahl aufheben
                </cc-button>
                
                <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    Löschen
                </cc-button>
    
                <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left" class="icon accent">
                        <img slot="left" src="../../../assets/icon/return.svg">                    
                    </div>
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
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/circle-plus.svg"/>
                        </div>
                        Gerät(e) hinzufügen
                    </cc-button>
    
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faCamera).html[0])}
                        </div>
                        Gerätetyp hinzufügen
                    </cc-button>
                </div>
                
                <div>
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">
                            <cc-circle-select slot="left"></cc-circle-select>
                        </div>
                        Auswahl aufheben
                    </cc-button>
    
                    <cc-button size="${ButtonSize.SMALL}" color="${ButtonColor.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">${unsafeSVG(icon(faTrash).html[0])}</div>
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
import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash, faCamera } from "@fortawesome/free-solid-svg-icons"
import {AppState, ObservedProperty, PageEnum} from "../../model"
import { ButtonType} from "../basic/button.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {
    @property()
    appState : ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT: return this.renderEquipmentBar();
            case PageEnum.RENTS: return this.renderRentListBar();
        }
    }

    renderRentListBar(){
        return html`
            <style>${styles}</style>
            <div class="main rentlist">
                <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left" class="icon accent">
                        <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                    </div>
                    Auswahl aufheben
                </cc-button>
                
                <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left" class="icon accent">
                        ${unsafeSVG(icon(faTrash).html[0])}
                    </div>
                    Löschen
                </cc-button>
    
                <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                    <div slot="left" class="icon accent">
                        <img slot="left" src="../../../assets/icon/return.svg" alt="<-">                    
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
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faCamera).html[0])}
                        </div>
                        Geräte bearbeiten
                    </cc-button>
                </div>
                
                <div>
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>
    
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
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
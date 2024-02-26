import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import {icon} from '@fortawesome/fontawesome-svg-core'
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {faCamera, faTrash} from "@fortawesome/free-solid-svg-icons"
import { ObservedProperty, PageEnum} from "../../model"
import {ButtonType} from "../basic/button.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import RentService, {RentStatus} from "../../service/rent.service";
import PopupEngine from "../../popupEngine";
import {AppState} from "../../service/AppState"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {

    @property()
    private appState: ObservedProperty<AppState>

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
        let isButtonDisabled = {
            uncheckAll: this.appState.value.selectedRentEntries.size == 0,
            remove: this.isButtonDisabled(RentStatus.DECLINED),
            return: this.isButtonDisabled(RentStatus.CONFIRMED)
        }

        return html`
            <style>${styles}</style>
            <div class="main rentlist">
                <div>
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faCamera).html[0])}
                        </div>
                        Geräte bearbeiten
                    </cc-button>
                </div>

                <div>
                    <cc-button @click="${this.uncheckAll}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" 
                               type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>
                    
                    <cc-button @click="${this.removeSelection}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.remove}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faTrash).html[0])}
                        </div>
                        Löschen
                    </cc-button>
        
                    <cc-button @click="${this.returnSelection}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.return}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/return.svg" alt="<-">                    
                        </div>
                        Zurückgeben
                    </cc-button>
                </div>
            </div>
        `
    }

    isButtonDisabled(status: RentStatus) {
        if (this.appState.value.selectedRentEntries.size == 0) return true

        let isDisabled = false;
        this.appState.value.selectedRentEntries.forEach((selected) => {
            if(selected.rent.status != status){
                return isDisabled = true;
            }
        })
        return isDisabled
    }

    uncheckAll() {
        this.appState.value.selectedRentEntries.forEach((entry) => {
            entry.toggleRentCheck()
        })
    }

    removeSelection() {
        PopupEngine.createModal({
            text: "Willst du wirklich diese Verleihe löschen?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        this.appState.value.selectedRentEntries.forEach((entry) => {
                            RentService.remove(entry.rent)
                        })
                        this.uncheckAll()
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }

    returnSelection() {
        PopupEngine.createModal({
            text: "Willst du wirklich diese Verleihe zurückgeben?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        this.appState.value.selectedRentEntries.forEach((entry) => {
                            RentService.return(entry.rent)
                        })
                        this.uncheckAll()
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
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
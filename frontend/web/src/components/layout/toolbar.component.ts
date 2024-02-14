import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/toolbar.styles.scss'
import {icon} from '@fortawesome/fontawesome-svg-core'
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {faCamera, faTrash} from "@fortawesome/free-solid-svg-icons"
import {AppState, ObservedProperty, PageEnum} from "../../model"
import {ButtonType} from "../basic/button.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {RentStatus} from "../../service/rent.service";
import PopupEngine from "../../popupEngine";

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
        let buttonsDisabled = {
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
                    <cc-button @click="${this.uncheckAll}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${buttonsDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>
                    
                    <cc-button @click="${this.removeSelection}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${buttonsDisabled.remove}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faTrash).html[0])}
                        </div>
                        Löschen
                    </cc-button>
        
                    <cc-button @click="${this.returnSelection}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${buttonsDisabled.return}">
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
        model.appState.value.selectedRentEntries.forEach((entry) => {
            entry.toggleRentCheck()
        })
    }

    removeSelection() {
        PopupEngine.createModal({
            text: "Willst du wirklich diese Verleihe löschen?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {console.log(data.inputValues[0], data.inputValues[1])},
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
        model.appState.value.selectedRentEntries.forEach((entry) => {
            console.log(entry)
        })
    }

    returnSelection() {
        PopupEngine.createModal({
            text: "Willst du wirklich diese Verleihe zurückgeben?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {console.log(data.inputValues[0], data.inputValues[1])},
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
        model.appState.value.selectedRentEntries.forEach((entry) => {
            console.log(entry)
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
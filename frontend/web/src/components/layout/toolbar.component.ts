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
import RentService, {RentStatusEnum} from "../../service/rent.service";
import PopupEngine from "../../popupEngine";
import {AppState} from "../../AppState"
import DeviceTypeService from "../../service/deviceType.service"
import {RentStatus} from "../basic/rentStatus.component"

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
            remove: this.isButtonDisabled(RentStatusEnum.DECLINED),
            return: this.isButtonDisabled(RentStatusEnum.CONFIRMED)
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
                    <cc-button @click="${() => {this.uncheckAll('rent')}}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" 
                               type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>
                    
                    <cc-button @click="${() => {this.removeSelection('rent')}}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.remove}">
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

    renderEquipmentBar() {
        let isButtonDisabled = {
            uncheckAll: this.appState.value.selectedDeviceEntries.size == 0,
            remove: this.appState.value.selectedDeviceEntries.size == 0,
        }

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
                    <cc-button @click=${() => {this.uncheckAll("device")}}
                               size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>
    
                    <cc-button @click="${() => {this.removeSelection('device')}}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.remove}">
                        <div slot="left" class="icon accent">${unsafeSVG(icon(faTrash).html[0])}</div>
                        Gerät(e) löschen
                    </cc-button>
                </div>
            </div>
        `
    }

    isButtonDisabled(status: RentStatusEnum) {
        if (this.appState.value.selectedRentEntries.size == 0) return true

        let isDisabled = false;
        this.appState.value.selectedRentEntries.forEach((selected) => {
            if(selected.rent.status != status){
                return isDisabled = true;
            }
        })
        return isDisabled
    }

    uncheckAll(type) {
        if(type === "rent"){
            this.appState.value.selectedRentEntries.forEach((entry) => {
                entry.toggleRentCheck(false)
            })
        } else if(type === "device"){
            this.appState.value.selectedDeviceEntries.forEach((entry) => {
                console.log(entry)
                entry.toggleDeviceCheck(false)
            })
        }
    }

    removeSelection(type) {
        PopupEngine.createModal({
            text: `Willst du wirklich diese ${type === 'rent' ? 'Verleihe' : 'Geräte'} löschen?`,
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        if(type === 'rent'){
                            this.appState.value.selectedRentEntries.forEach((entry) => {
                                RentService.remove(entry.rent)
                            })
                        } else if(type === 'device'){
                            this.appState.value.selectedDeviceEntries.forEach((entry) => {
                                DeviceTypeService.remove(entry.deviceTypeFull.deviceType)
                            })
                        }
                        this.uncheckAll(type)
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
                            RentService.return(entry.rent.rent_id)
                        })
                        this.uncheckAll("rent")
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-toolbar": ToolbarComponent
    }
}
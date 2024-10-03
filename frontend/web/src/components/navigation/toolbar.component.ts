import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/navigation/toolbar.styles.scss'
import {icon} from '@fortawesome/fontawesome-svg-core'
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {faCamera, faTrash, faUpload} from "@fortawesome/free-solid-svg-icons"
import { ObservedProperty, PageEnum} from "../../model"
import {ButtonType} from "../basic/button.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import RentService, {RentStatusEnum} from "../../service/rent.service";
import PopupEngine from "../../util/PopupEngine";
import {AppState} from "../../AppState"
import DeviceTypeService from "../../service/deviceType.service"
import {RentStatus} from "../basic/rentStatus.component"
import UrlHandler from "../../util/UrlHandler";
import DeviceService from "../../service/device.service"
import DeviceSetService from "../../service/deviceSet.service"

@customElement('cc-toolbar')
export class ToolbarComponent extends LitElement {

    @property()
    private appState: ObservedProperty<AppState>

    @property({reflect: true}) type: "default" | "edit" = "default"

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }
    render() {
        if(this.type == "edit"){
            return this.renderEditBar()
        }

        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT: return this.renderEquipmentBar()
            case PageEnum.RENTS: return this.renderRentListBar()
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
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               @click="${() => {
                                   UrlHandler.goToPage("/app/edit?type=camera")
                               }}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faCamera).html[0])}
                        </div>
                        Geräte bearbeiten
                    </cc-button>
                </div>

                <div>
                    <cc-button @click="${() => {
                        this.uncheckAll('rent')
                    }}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}"
                               type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/custom/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>

                    <cc-button @click="${() => {
                        this.removeSelection()
                    }}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               .disabled="${isButtonDisabled.remove}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faTrash).html[0])}
                        </div>
                        Löschen
                    </cc-button>

                    <cc-button @click="${this.returnSelection}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}"
                               type="${ButtonType.TEXT}" .disabled="${isButtonDisabled.return}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/custom/return.svg" alt="<-">
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
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               @click="${() => {
                                   UrlHandler.goToPage("/app/edit?type=camera")
                               }}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faCamera).html[0])}
                        </div>
                        Geräte bearbeiten
                    </cc-button>
                </div>

                <div>
                    <cc-button @click=${() => {
                        this.uncheckAll("device")
                    }}
                               size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               .disabled="${isButtonDisabled.uncheckAll}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/custom/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>

                    <cc-button @click="${() => {
                        this.rentSelection()
                    }}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               .disabled="${isButtonDisabled.remove}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/custom/return.svg" alt="<-">
                        </div>
                        Gerät(e) verleihen
                    </cc-button>
                </div>
            </div>
        `
    }

    renderEditBar(){
        let isButtonDisabled = this.appState.value.selectedDeviceTypeEditEntries.size == 0 &&
            this.appState.value.selectedDeviceEditEntries.size == 0 &&
            this.appState.value.selectedDeviceSetEditEntries.size == 0

        let type : "editDevice" | "editDeviceType" | "editDeviceSet"
            = UrlHandler.getUrl().includes("children") ? "editDevice" : "editDeviceType"

        if(UrlHandler.getParam("type") == "set"){
            type = "editDeviceSet"
        }

        return html`
            <style>${styles}</style>
            <div class="main equipment">
                <div>
                    <cc-button size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               @click="${() => {
                                   UrlHandler.goToPage("/app/edit")
                               }}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faUpload).html[0])}
                        </div>
                        Importieren / Exportieren
                    </cc-button>
                </div>

                <div>
                    <cc-button @click=${() => {
                        this.uncheckAll("edit")
                    }} size="${SizeEnum.SMALL}"
                               color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               .disabled="${isButtonDisabled}">
                        <div slot="left" class="icon accent">
                            <img slot="left" src="../../../assets/icon/custom/select_circle.svg" alt="+">
                        </div>
                        Auswahl aufheben
                    </cc-button>

                    <cc-button @click="${() => {
                        this.removeSelection(type)
                    }}" size="${SizeEnum.SMALL}" color="${SimpleColorEnum.GRAY}" type="${ButtonType.TEXT}"
                               .disabled="${isButtonDisabled}">
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faTrash).html[0])}
                        </div>
                        Löschen
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
                entry.toggleDeviceCheck()
            })
        } else if(type === "edit"){
            this.appState.value.clearSelectedDeviceEditEntries()
            this.appState.value.clearSelectedDeviceTypeEditEntries()
            this.appState.value.clearSelectedDeviceSetEditEntries()
        }
    }

    rentSelection() {
        model.appState.value.openCreateRentModalWithDevices(this.appState.value.selectedDeviceEntries)
    }

    removeSelection(type : "rent" | "editDevice" | "editDeviceType" | "editDeviceSet" = "rent") {
        PopupEngine.createModal({
            text: `${type === "rent" ? "Willst du wirklich diese Verleihe löschen?" 
                : type === "editDevice" ? "Willst du wirklich diese Geräte löschen?"
                : type === "editDeviceType" ? "Willst du wirklich diese Gerätetypen löschen?"
                : "Willst du wirklich diese Geräte-Sets löschen?"}`,
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        switch(type){
                            case "rent":
                                this.appState.value.selectedRentEntries.forEach((entry) => {
                                    RentService.remove(entry.rent)
                                })
                                this.uncheckAll("rent")
                                break;
                            case "editDevice":
                                this.appState.value.selectedDeviceEditEntries.forEach((entry) => {
                                    DeviceService.remove(entry.device)
                                })
                                this.uncheckAll("edit")
                                break;
                            case "editDeviceType":
                                this.appState.value.selectedDeviceTypeEditEntries.forEach((entry) => {
                                    DeviceTypeService.remove(entry.deviceType.deviceType)
                                })
                                this.uncheckAll("edit")
                                break;
                            case "editDeviceSet":
                                this.appState.value.selectedDeviceSetEditEntries.forEach((entry) => {
                                    DeviceSetService.remove(entry.deviceSet)
                                })
                                this.uncheckAll("edit")
                                break;
                        }
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
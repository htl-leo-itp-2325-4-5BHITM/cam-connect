import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {Api, ColorEnum, DatePickerWrapper, Orientation, SimpleOption, SizeEnum} from "../../base"
import RentService, {Rent, RentStatusEnum, RentTypeEnum} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"
import {model} from "../../index"
import {LineColor} from "../basic/line.component"
import PopupEngine from "../../popupEngine"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import Util from "../../util"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faHashtag} from "@fortawesome/free-solid-svg-icons"
import DeviceService, {Device, DeviceDTO, SearchDTO} from "../../service/device.service"
import {AutocompleteComponent} from "../basic/autocomplete.component"
import DeviceTypeService, {DeviceType, DeviceTypeSource} from "../../service/deviceType.service"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rent: Rent

    private lastStatus = RentStatusEnum.WAITING

    @property()
    private appState: ObservedProperty<AppState>

    private datePicker : DatePickerWrapper

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

            this.classList.add("hoverHighlighted")
        if(model.appState.value.userSettings.showHoverEffectOfRentListEntry){

        }
    }

    protected performUpdate() {
        super.performUpdate();
        this.setAttribute("status", this.rent.status)
    }

    protected updated() {
        let startDate = this.rent.rent_start
        let endDate = this.rent.rent_end_planned

        let input = this.renderRoot.querySelector('.date') as HTMLInputElement
        
        //todo this.datePicker?.instance.destroy();
        if(!this.datePicker || this.lastStatus != this.rent.status) {
            this.lastStatus = this.rent.status
            this.datePicker = new DatePickerWrapper(input, [new Date(startDate), new Date(endDate)],
        async (dates) => {
                    await RentService.updateProperty(this.rent.rent_id, 'rent_start', Util.formatDateForDb(dates[0]))
                    RentService.updateProperty(this.rent.rent_id, 'rent_end_planned', Util.formatDateForDb(dates[1]))
                }
            )
        }
    }

    render() {
        let buttonClickBehavior
        let buttonColor = ColorEnum.ACCENT
        let buttonText = ""
        let chipColor = ColorEnum.GRAY
        let chipText = ""
        let chipType
        switch (this.rent.status) {
            case RentStatusEnum.CONFIRMED:
                buttonClickBehavior = this.returnRent
                buttonText = "Zurückgeben"
                chipColor = ColorEnum.GOOD
                chipText = "Bestätigt"
                break
            case RentStatusEnum.WAITING:
                chipColor = ColorEnum.MID
                chipText = "Warte auf Bestätigung"
                break
            case RentStatusEnum.DECLINED:
                buttonClickBehavior = this.removeRent
                buttonColor = ColorEnum.GRAY
                buttonText = "Löschen"
                chipColor = ColorEnum.BAD
                chipText = "Abgelehnt"
                chipType = ChipType.EXPANDABLE
                break
            case RentStatusEnum.RETURNED:
                chipText = "Zurückgegeben"
                break
        }

        return html`
            <style>${styles}</style>
            
            <div class="area">
                ${this.generateRentContent()}
            </div>

            <div class="area">
                <cc-button color="${buttonColor}" 
                           type="${ButtonType.TEXT}" size="${SizeEnum.SMALL}"
                           @click="${buttonClickBehavior}"
                           text="${buttonText}"
                ></cc-button>
                
                <cc-chip color="${chipColor}" size="${SizeEnum.SMALL}"
                         type="${chipType}" 
                         text="${chipText}">
                    <div class="details">
                        <h2>Angegebener Ablehngrund:</h2>
                        <p>${this.rent.verification_message}</p>
                        <cc-button closeChip @click="${this.requestConfirmation}" 
                                   type="${ButtonType.OUTLINED}" color="${ColorEnum.GRAY}" 
                                   size="${SizeEnum.SMALL}">Bestätigung erneut Anfragen
                        </cc-button>
                    </div>
                </cc-chip>
                
                <cc-circle-select .onToggle="${(checked: boolean) => this.toggleRentCheck(checked)}" 
                                  .checked="${this.appState.value.selectedRentEntries.has(this)}" 
                                  size="${SizeEnum.SMALL}"
                ></cc-circle-select>
            </div>
        `
    }

    generateRentContent() {
        if(this.rent.status == RentStatusEnum.DECLINED) { //editable rent
            return html`
                ${this.rent.type == RentTypeEnum.DEFAULT ?
                        html`
                            <cc-autocomplete placeholder="Name" class="name"
                                     .selected="${{id: this.rent.device?.type?.type_id, data: this.rent.device?.type}}"
                                     .onSelect="${(option: DeviceType) => {
                                         //if the selected device matches the selected type, do nothing
                                         if (this.rent.device.type == option) return
                                      
                                         if(option == null) {
                                         }
                                         else {
                                             this.rent.device.type = option
                                         }
             
                                         //reset the device type
                                         this.rent.device.device_id = -1
                                         let numberInput = this.shadowRoot.querySelector('cc-autocomplete.number') as AutocompleteComponent<DeviceDTO>
                                         numberInput.clear()
                                     }}"
                                     .querySuggestions="${DeviceTypeService.search}"
                                     .iconProvider="${DeviceTypeService.deviceTypeToIcon}"
                                     .contentProvider="${(data: DeviceType) => {return data.name}}"
                                     allowNoSelection="true"
                            ></cc-autocomplete>
                            <cc-autocomplete placeholder="Nr." class="number"
                                     .selected="${{id: this.rent?.device?.device_id, data: this.rent?.device}}"
                                     .onSelect="${(option: Device, isInitialCall) => {
                                         this.rent.device = option
             
                                         if(this.rent.device.type == null) return
                                      
                                         let typeInput = this.shadowRoot.querySelector('cc-autocomplete.name') as AutocompleteComponent<DeviceType>
                                         typeInput.selectSuggestion({id: option.type.type_id, data: option.type})
                                         
                                         //TODO dont run these on intial load
                                         if(option.device_id > -1 && !isInitialCall)
                                             RentService.updateProperty(this.rent.rent_id, 'device', option.device_id)
                                     }}"
                                     .querySuggestions="${(searchTerm) => this.searchForDevice(searchTerm)}"
                                     .iconProvider="${this.provideDeviceIcon}"
                                     .contentProvider="${(data: Device) => {return data.number}}"
                            ></cc-autocomplete>
                        ` :
                        html`
                            <input type="text" value="${this.rent.device_string}" placeholder="Name">
                        `
                }
                
                <cc-line color=${LineColor.DEFAULT} type="${Orientation.VERTICAL}"></cc-line>
 
                <input type="text" class="date">
                
                <cc-line color=${LineColor.DEFAULT} type="${Orientation.VERTICAL}"></cc-line>
                
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von" 
                                   value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}">
                </cc-property-value>`
        } else { //static rent
            return html`
                ${this.rent.type == RentTypeEnum.DEFAULT ?
                        html`
                            <div class="deviceInfos">
                                <span>${this.rent.device.type.name}</span>
                                <span>•</span>
                                <span>${this.rent.device.number}</span>
                            </div>
                        ` :
                        html`
                            <p>${this.rent.device_string}</p>
                        `
                }
                
                <cc-line color=${LineColor.LIGHTER} type="${Orientation.VERTICAL}"></cc-line>
                
                <div class="time">
                    <span>
                        ${Util.formatDateForHuman(this.rent.rent_start)}
                    </span>
                    <span>-</span>
                    <span>
                        ${Util.formatDateForHuman(this.rent.rent_end_planned)}
                    </span>
                </div>
                
                <cc-line color=${LineColor.LIGHTER} type="${Orientation.VERTICAL}"></cc-line>
                
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von"
                                   value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}">
                </cc-property-value>`
        }
    }
    async searchForDevice(searchTerm: string): Promise<SimpleOption<number, Device>[]> {
        let searchDTO : SearchDTO = {
            searchTerm: searchTerm,
            typeId: this.rent?.device.type.type_id,
            onlyAvailable: true
        }

        return DeviceService.search(searchDTO)
    }

    provideDeviceIcon(data: DeviceDTO){
        return html`${unsafeSVG(icon(faHashtag).html[0])}`
    }

    toggleRentCheck(checked?: boolean){
        if(checked == undefined) checked = !this.isChecked() //inverted because this function changes the state later

        if(checked == true){
            this.appState.value.addSelectedRentEntry(this)
        } else{
            this.appState.value.removeSelectedRentEntry(this)
        }
    }

    isChecked(){
        return this.appState.value.selectedRentEntries.has(this)
    }

    requestConfirmation() {
        this.rent.status = RentStatusEnum.WAITING
        RentService.requestConfirmation(this.rent)
    }

    removeRent() {
        PopupEngine.createModal({
            text: "Willst du wirklich diesen Verleih löschen?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        RentService.remove(this.rent)
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }

    returnRent() {
        PopupEngine.createModal({
            text: "Willst du wirklich diesen Verleih zurückgeben?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        RentService.return(this.rent.rent_id)
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
        "cc-rent-list-entry": RentListEntryComponent
    }
}
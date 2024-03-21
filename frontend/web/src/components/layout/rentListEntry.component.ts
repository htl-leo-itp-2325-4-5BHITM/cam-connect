import {html, LitElement, PropertyValues, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {Api, ccResponse, ColorEnum, DatePickerWrapper, SizeEnum} from "../../base"
import RentService, {Rent, RentStatus, RentTypeEnum} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"
import {model} from "../../index"
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import {LineColor, LineType} from "../basic/line.component"
import PopupEngine from "../../popupEngine"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import Util, {Logger} from "../../util"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCamera, faHashtag, faHelicopter, faLightbulb, faMicrophone} from "@fortawesome/free-solid-svg-icons"
import DeviceService, {Device, DeviceDTO} from "../../service/device.service"
import {AutocompleteComponent, AutocompleteOption} from "../basic/autocomplete.component"
import DeviceTypeService, {DeviceType, DeviceTypeSource, DeviceTypeVariantEnum} from "../../service/deviceType.service"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rent: Rent

    @property()
    private appState: ObservedProperty<AppState>

    private datePicker : DatePickerWrapper

    private logger = new Logger(true, "rentListEntry")

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    protected performUpdate() {
        super.performUpdate();
        this.setAttribute("status", this.rent.status)
    }

    protected updated() {
        let startDate = this.rent.rent_start
        let endDate = this.rent.rent_end_planned

        this.logger.log(this.rent.rent_id, startDate, endDate)

        let input = this.renderRoot.querySelector('.date') as HTMLInputElement
        
        //todo this.datePicker?.instance.destroy();
        if(!this.datePicker)
        this.datePicker = new DatePickerWrapper(input, [new Date(startDate), new Date(endDate)])
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <div class="area">
                ${this.generateRentContent()}
            </div>

            <div class="area">
                <!--TODO move this code into a more readable generator function-->
                <!--TODO this button should not be displayed if the status is waiting-->
                <!--please no nested ternary operators 🤮 -->
                <cc-button color="${this.rent.status == RentStatus.DECLINED ? ColorEnum.GRAY : ColorEnum.ACCENT}" 
                           type="${ButtonType.TEXT}" size="${SizeEnum.SMALL}"
                           @click="${this.rent.status == RentStatus.DECLINED ? this.removeRent : this.rent.status == RentStatus.CONFIRMED ? this.returnRent : ''}"
                           text="${this.rentStatusToButtonText(this.rent.status)}">
                </cc-button>
                
                <cc-chip color="${this.rentStatusToColor(this.rent.status)}" size="${SizeEnum.SMALL}"
                         type="${this.rent.status == RentStatus.DECLINED ? ChipType.EXPANDABLE : ''}" 
                         text="${this.rentStatusAsString(this.rent.status)}">
                    <div class="detail">
                        <h2>angegebener Ablehngrund</h2>
                        <p>${this.rent.verification_message}</p>
                        <cc-button @click="${this.requestConfirmation}" type="${ButtonType.OUTLINED}" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}">Bestätigung erneut Anfragen</cc-button>
                    </div>
                </cc-chip>
                
                <cc-circle-select .onToggle="${() => this.toggleRentCheck()}" 
                                  .checked="${this.appState.value.selectedRentEntries.has(this)}" 
                                  size="${SizeEnum.SMALL}"
                ></cc-circle-select>
            </div>
        `
    }
    /*
     * @Michi sidenote
     * I renamed this function from getRentInfoSection since:
     * it's not a simply getting a result but generating the result
     * it's not really about the info tbh this is just the content of the entry
     * saying it's a section is about as descriptive as saying that is html
     *
     * my function name is not perfect either, but you get the idea that this function generates the content of the rent
     */
    generateRentContent() {
        if(this.rent.status == RentStatus.DECLINED) { //editable rent
            return html`
                ${this.rent.type == RentTypeEnum.DEFAULT ?
                        html`
                            <cc-autocomplete placeholder="Name" class="name"
                                             .selected="${{id: this.rent.device.type.type_id, data: this.rent.device.type}}"
                                             .onSelect="${(option: DeviceType) => {
                                                 this.rent.device.type = option
                                                 let numberInput = this.shadowRoot.querySelector('cc-autocomplete.number') as AutocompleteComponent<DeviceDTO>
                                                 numberInput.clear()
                                             }}"
                                             .querySuggestions="${DeviceTypeService.search}"
                                             .iconProvider="${DeviceTypeService.deviceTypeToIcon}"
                                             .contentProvider="${(data: DeviceTypeSource) => {return data.name}}">
                            </cc-autocomplete>
                            <cc-autocomplete placeholder="Nr." class="number"
                                             .selected="${{id: this.rent.device.device_id, data: this.rent.device}}"
                                             .onSelect="${(option: Device) => {
                                                 let type = this.rent.device.type
                                                 this.rent.device = option
                                                 this.rent.device.type = type
                                                 RentService.updateProperty(this.rent.rent_id, 'device', this.rent.device)
                                             }}"
                                             .querySuggestions="${(searchTerm) => this.searchForDevice(searchTerm)}"
                                             .iconProvider="${this.provideDeviceIcon}"
                                             .contentProvider="${(data: DeviceDTO) => {return data.number}}">
                            </cc-autocomplete>
                            <!--<cc-autocomplete placeholder="Name" class="name"
                                     .selected="${{id: this.rent.device.type.type_id, data: this.rent.device.type}}"
                                     .onSelect="${(option: DeviceType) => {
                                            if(option == null) {
                                                this.rent.device.type = null
                                            }
                                            else {
                                                this.rent.device.type = option
                                            }
                
                                            //if the selected device matches the selected type, do nothing
                                            if (this.rent.device.type == this.rent.device.type) return
                
                                            //reset the device type
                                            this.rent.device = null
                                            let numberInput = this.shadowRoot.querySelector('cc-autocomplete.number') as AutocompleteComponent<DeviceDTO>
                                            numberInput.clear()
                                        }}"
                                     .querySuggestions="${DeviceTypeService.search}"
                                     .iconProvider="${DeviceTypeService.deviceTypeToIcon}"
                                     .contentProvider="${(data: DeviceType) => {return data.name}}"
                                     allowNoSelection="true"
                            ></cc-autocomplete>
                            <cc-autocomplete placeholder="Nr." class="number" 
                                             .onSelect="${(option: Device) => {
                                                    this.rent.device = option
                        
                                                    if(this.rent.device.type == null) return
                        
                                                    Api.fetchData<DeviceTypeSource>(`/devicetype/getbyid/${option.type.type_id}`)
                                                            .then((deviceType: DeviceType) => {
                                                                let typeInput = this.shadowRoot.querySelector('cc-autocomplete.name') as AutocompleteComponent<DeviceType>
                                                                typeInput.selectSuggestion({id: deviceType.type_id, data: deviceType})
                                                            })
                                                }}"
                                             .querySuggestions="${(searchTerm) => this.searchForDevice(searchTerm)}"
                                             .iconProvider="${this.provideDeviceIcon}"
                                             .contentProvider="${(data: DeviceDTO) => {return data.number}}"
                            ></cc-autocomplete>-->
                        ` :
                        html`
                            <input type="text" value="${this.rent.device_string}" placeholder="Name">
                        `
                }
                
                <cc-line color=${LineColor.LIGHT} type="${LineType.VERTICAL}"></cc-line>
 
                <input type="text" class="date">
                
                <cc-line color=${LineColor.LIGHT} type="${LineType.VERTICAL}"></cc-line>
                
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
                
                
                <cc-line color=${LineColor.LIGHTER} type="${LineType.VERTICAL}"></cc-line>
                
                <div class="time">
                    <span>
                        ${Util.formatDateForHuman(this.rent.rent_start)}
                    </span>
                    <span>-</span>
                    <span>
                        ${Util.formatDateForHuman(this.rent.rent_end_planned)}
                    </span>
                </div>
                
                <cc-line color=${LineColor.LIGHTER} type="${LineType.VERTICAL}"></cc-line>
                
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von"
                                   value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}">
                </cc-property-value>`
        }
    }
    async searchForDevice(searchTerm: string): Promise<AutocompleteOption<DeviceDTO>[]> {
        if(this.rent.device.type.type_id < 0) return DeviceService.search(searchTerm)

        return DeviceService.searchWithType(searchTerm, this.rent.device.type.type_id)
    }

    provideDeviceIcon(data: DeviceDTO){
        return html`${unsafeSVG(icon(faHashtag).html[0])}`
    }

    toggleRentCheck(checked?: boolean){
        if(!checked) checked = !this.isChecked()

        if(checked){
            this.appState.value.addSelectedRentEntry(this)
        } else{
            this.appState.value.removeSelectedRentEntry(this)
        }
    }

    isChecked(){
        return this.appState.value.selectedRentEntries.has(this)
    }

    requestConfirmation() {
        PopupEngine.createModal({
            text: "Willst du wirklich diesen Verleih neu Anfragen?",
            buttons: [
                {
                    text: "Ja",
                    action: (data) => {
                        this.rent.status = RentStatus.WAITING
                        RentService.updateProperty(this.rent.rent_id, 'rentstart', Util.formatDateForDb(this.datePicker.instance.selectedDates[0]))
                        RentService.updateProperty(this.rent.rent_id, 'rentendplanned', Util.formatDateForDb(this.datePicker.instance.selectedDates[1]))
                        //RentService.requestConfirmation(this.rent)
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
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
                        RentService.return(this.rent)
                    },
                    closePopup: true
                },
                {
                    text: "Nein",
                },
            ]
        })
    }

    rentStatusToButtonText(status: RentStatus){
        switch (status) {
            case RentStatus.CONFIRMED: return "Zurückgeben"
            case RentStatus.DECLINED: return "Löschen"
        }
    }

    rentStatusToColor(status: RentStatus) {
        switch (status) {
            case RentStatus.CONFIRMED: return ColorEnum.GOOD
            case RentStatus.WAITING: return ColorEnum.MID
            case RentStatus.DECLINED: return ColorEnum.BAD
            default: return ColorEnum.GRAY
        }
    }

    rentStatusAsString(status: RentStatus) {
        switch (status) {
            case RentStatus.CONFIRMED: return "Bestätigt"
            case RentStatus.WAITING: return "Warte auf Bestätigung"
            case RentStatus.DECLINED: return "Abgelehnt"
            case RentStatus.RETURNED: return "Zurückgegeben"
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-entry": RentListEntryComponent
    }
}
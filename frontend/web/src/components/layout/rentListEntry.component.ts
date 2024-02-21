import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum, SizeEnum} from "../../base"
import RentService, {Rent, RentStatus, RentTypeEnum} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"
import {model} from "../../index"
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import {LineColor, LineType} from "../basic/line.component"
import PopupEngine from "../../popupEngine"
import {ObservedProperty} from "../../model"
import {AppState} from "../../service/AppState"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rent: Rent

    @property({ type: Boolean, reflect: true })
    checked: boolean = false

    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        let startDate = this.rent.rent_start
        let endDate = this.rent.rent_end_actual || this.rent.rent_end_planned

        //TODO this will probably not work if the rent changes from waiting to declined
        let globalInput = this.renderRoot.querySelector('.date') as HTMLInputElement
        new AirDatepicker(globalInput, {
            locale: localeEn,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: [startDate, endDate]
        })
    }

    protected performUpdate() {
        super.performUpdate();
        this.setAttribute("status", this.rent.status)
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <div>    
                ${this.generateRentContent()}
            </div>

            <div>
                <!--TODO move this code into a more readable generator functioin-->
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
                        <cc-button type="${ButtonType.OUTLINED}" color="${ColorEnum.GRAY}" size="${SizeEnum.SMALL}">Bestätigung erneut Anfragen</cc-button>
                    </div>
                </cc-chip>
                
                <cc-circle-select @click="${() => {this.toggleRentCheck()}}" .checked="${this.checked}" size="${SizeEnum.SMALL}"></cc-circle-select>
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
                            <input type="text" value="${this.rent.device.type.name}">
                            <input type="text" class="number" value="${this.rent.device.number}">
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
/*
            console.log(this.rent.rent_start.toLocaleDateString("de-DE", {day: '2-digit', month: '2-digit'}))
*/
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
                        ${this.rent.rent_start}
                    </span>
                    <span>-</span>
                    <span>${this.rent.rent_end_planned}</span>
                </div>
                
                <cc-line color=${LineColor.LIGHTER} type="${LineType.VERTICAL}"></cc-line>
                
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von"
                                   value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}">
                </cc-property-value>`
        }
    }

    toggleRentCheck(){
        this.checked = !this.checked

        if(this.checked){
            this.appState.value.addSelectedRentEntry(this)
        } else{
            this.appState.value.removeSelectedRentEntry(this)
        }

        this.appState.value.update()
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
        })    }

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
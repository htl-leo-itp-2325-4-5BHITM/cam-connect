import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum, config, SizeEnum} from "../../base"
import RentService, {Rent, RentStatus} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"
import {model} from "../../index"
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";
import {LineColor, LineType} from "../basic/line.component"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCircleArrowDown} from "@fortawesome/free-solid-svg-icons"
import PopupEngine from "../../popupEngine"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rent: Rent

   /* @property({reflect: true})
    status: RentStatus = this.rent.status*/

    @property({ type: Boolean, reflect: true })
    checked: boolean = false

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        let startDate = this.rent.rent_start
        let endDate = this.rent.rent_end_actual || this.rent.rent_end_planned

        let globalInput = this.renderRoot.querySelector('.globaltime input') as HTMLInputElement
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
                ${this.getRentInfoSection()}
            </div>

            <div>
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

    getRentInfoSection() {
        if(this.rent.status == RentStatus.DECLINED) {
            return html`
                <input type="text" value="${this.rent.device.type.name}">
                <input type="text" class="number" value="${this.rent.device.number}">
                <cc-line color=${LineColor.LIGHT} type="${LineType.VERTICAL}"></cc-line>
                <div class="globaltime">
                    <div class="dateInputArea">
                        <input type="text" class="date">
                        <icon-cta>${unsafeSVG(icon(faCircleArrowDown).html[0])}</icon-cta>
                    </div>
                </div>
                <cc-line color=${LineColor.LIGHT} type="${LineType.VERTICAL}"></cc-line>
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von" value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}"></cc-property-value>`
        } else {
            return html`
                <div class="deviceInfos">
                    <span>${this.rent.device.type.name}</span>
                    <span>•</span>
                    <span>${this.rent.device.number}</span>
                </div>
                
                <cc-line color=${LineColor.LIGHTER} type="${LineType.VERTICAL}"></cc-line>
                <div class="globaltime">
                    <div class="dateInputArea">
                        <input type="text" class="date" disabled>
                        <icon-cta>${unsafeSVG(icon(faCircleArrowDown).html[0])}</icon-cta>
                    </div>
                </div>
                <cc-line color=${LineColor.LIGHTER} type="${LineType.VERTICAL}"></cc-line>
                
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von"
                                   value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}"></cc-property-value>`
        }
    }

    toggleRentCheck(){
        this.checked = !this.checked

        if(this.checked){
            model.addSelectedRentEntry(this)
        } else{
            model.removeSelectedRentEntry(this)
        }
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
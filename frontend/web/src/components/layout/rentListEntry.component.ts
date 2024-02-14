import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum, SizeEnum} from "../../base"
import {Rent, RentStatus} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"
import {LineType} from "../basic/line.component"
import {model} from "../../index"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rent: Rent

    @property({ type: Boolean, reflect: true })
    checked: boolean = false

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        this.setAttribute("status", this.rent.status)
    }

    render() {
        return html`
            <style>${styles}</style>

            <div>
                <input type="text" value="${this.rent.device.type.name}">
                <input type="text" class="number" value="${this.rent.device.number}">
                <cc-line type="${LineType.VERTICAL}"></cc-line>
                <input type="date" class="customDate" value="${this.rent.rent_start}"/>
                <cc-line type="${LineType.VERTICAL}"></cc-line>
                <input type="date" class="customDate" value="${this.rent.rent_end_actual || this.rent.rent_end_planned}"/>
                <cc-line type="${LineType.VERTICAL}"></cc-line>

                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von" value="${this.rent.teacher_start.firstname.charAt(0)}. ${this.rent.teacher_start.lastname}"></cc-property-value>
            </div>

            <div>
                <cc-button color="${this.rent.status == RentStatus.DECLINED ? ColorEnum.GRAY : ColorEnum.ACCENT}" 
                           type="${ButtonType.TEXT}" size="${SizeEnum.SMALL}"
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
                
                <cc-circle-select @click="${() => {this.selectRent(this)}}" .checked="${this.checked}" size="${SizeEnum.SMALL}"></cc-circle-select>
            </div>
        `
    }

    selectRent(elem){
        elem.checked = !elem.checked

        if(elem.checked){
            model.addSelectedRentEntry(this)
        } else{
            model.removeSelectedRentEntry(this)
        }

        console.log(model.appState.value.selectedRentEntries)
    }

    rentStatusToButtonText(status: RentStatus){
        switch (status) {
            case RentStatus.CONFIRMED: return "Zurückgeben"
            case RentStatus.DECLINED:
            case RentStatus.RETURNED: return "Löschen"
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
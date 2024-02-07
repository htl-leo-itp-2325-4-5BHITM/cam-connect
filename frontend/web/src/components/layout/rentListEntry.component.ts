import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import { ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum, SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index";
import {Rent, RentStatus} from "../../service/rent.service";
import {ChipType} from "../basic/chip.component"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {
    @property()
    rentNumber?: number

    render() {
        let rent = model.rents.value[this.rentNumber]
        console.log(rent)

        return html`
            <style>${styles}</style>

            ${this.generateHeading(rent.student.firstname + " " + rent.student.lastname, rent.student.school_class)}
            <div class="entries">
                ${rent.rentList.map(rent => {
                    return this.generateRent(rent)
                })}
            </div>
        `
    }

    generateHeading(name: string, schoolClass: string) {
        return html`
            <div class="heading">
                <div class="left">
                    <p>${name}</p>
                    <p>•</p>
                    <p>${schoolClass}</p>
                </div>
                <div class="right">
                    <cc-button>Verleih erstellen</cc-button>
                    <cc-button color="${SimpleColorEnum.GRAY}">Details anzeigen</cc-button>
                    <cc-circle-select type="${CircleSelectType.MULTIPLE}" @click="${this.selectAll}"></cc-circle-select>
                </div>
            </div>
        `
    }

    generateRent(rent: Rent){
        return html`
            <div class="entry ${rent.status}">
                <div>
                    <input type="text" value="${rent.device.type.name}">
                    <input type="text" class="number" value="${rent.device.number}">
                    <label for="">|</label>
                    <input type="date" class="customDate" value="${rent.rent_start}"/>
                    <label for="" class="line">-</label>
                    <input type="date" class="customDate" value="${rent.rent_end_actual || rent.rent_end_planned}"/>
                    <label for="">|</label>

                    <div>
                        <p>Erstellt von:</p>
                        <p>${rent.teacher_start.firstname.charAt(0) + ". " + rent.teacher_start.lastname}</p>
                    </div>
                </div>

                <div>
                    <cc-button color="${rent.status == RentStatus.DECLINED ? ColorEnum.GRAY : ColorEnum.ACCENT}" 
                               type="${ButtonType.TEXT}" 
                               text="${this.rentStatusToButtonText(rent.status)}">
                    </cc-button>
                    
                    <cc-chip color="${this.rentStatusToColor(rent.status)}" 
                             type="${rent.status == RentStatus.DECLINED ? ChipType.EXPANDABLE : ChipType.EXPANDABLE}" 
                             text="${this.rentStatusAsString(rent.status)}"
                    >
                        <div class="detail">
                            <h2>angegebener Ablehngrund</h2>
                            <p>${rent.verification_message}</p>
                            <cc-button type="${ButtonType.OUTLINED}" color="${ColorEnum.GRAY}">Bestätigung erneut Anfragen</cc-button>
                        </div>
                    </cc-chip>
                    
                    <cc-circle-select @click="${this.autoCheckMultipleSelect}"></cc-circle-select>
                </div>
            </div>
        `
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

    selectAll(elem) {
        this.shadowRoot.querySelectorAll("cc-circle-select").forEach(select => {
            if(select.getAttribute("type") != CircleSelectType.MULTIPLE){
                select.checked = elem.target.checked
            }
        })
    }

    /**
     * this function detects if all selects are checked or not
     * if so the multiple select gets checked as well
     */
    autoCheckMultipleSelect() {
        let multiple = this.shadowRoot.querySelector(`cc-circle-select`)
        multiple.checked = true

        this.shadowRoot.querySelectorAll("cc-circle-select").forEach(select => {
            if(select.getAttribute("type") != CircleSelectType.MULTIPLE){
                if(!select.checked){
                    multiple.checked = false
                }
            }
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-entry": RentListEntryComponent
    }
}
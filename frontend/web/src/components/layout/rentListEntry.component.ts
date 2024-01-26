import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"
import {ChipSize} from "../basic/chip.component";
import {model} from "../../index";
import {Rent, RentStatus} from "../../service/rent.service";

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

    generateHeading(name, classes) {
        return html`
            <div class="heading">
                <div class="leftSide">
                    <p>${name}</p>
                    <p>•</p>
                    <p>${classes}</p>
                </div>
                <div class="rightSide">
                    <cc-button>Verleih erstellen</cc-button>
                    <cc-button color="${ButtonColor.GRAY}">Details anzeigen</cc-button>
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
                    <cc-button color="${rent.status == RentStatus.DECLINED ? ColorEnum.GRAY : ColorEnum.ACCENT}" type="${ButtonType.TEXT}" text="${this.getButtonTextOfStatus(rent.status)}"></cc-button>
                    
                    <cc-chip color="${this.getColorOfStatus(rent.status)}" size="${ChipSize.BIG}" expandable="${rent.status == RentStatus.DECLINED}">
                        <div>
                           ${this.getStringOfStatus(rent.status)}
                        </div>
                        <div class="detail">
                            <h2>angegebener Ablehngrund</h2>
                            <p>${rent.verification_message}</p>
                            <cc-button type="${ButtonType.OUTLINED}" color="${ColorEnum.GRAY}">Bestätigung erneut Anfragen</cc-button>
                        </div>
                    </cc-chip>
                    
                    <cc-circle-select @click="${this.checkAllSelects}"></cc-circle-select>
                </div>
            </div>
        `
    }

    getButtonTextOfStatus(status: RentStatus){
        switch (status) {
            case RentStatus.CONFIRMED: return "Zurückgeben"
            case RentStatus.DECLINED:
            case RentStatus.RETURNED: return "Löschen"
        }
    }

    getStringOfStatus(status: RentStatus){
        switch (status) {
            case RentStatus.CONFIRMED: return "Bestätigt"
            case RentStatus.WAITING: return "Warte auf Bestätigung"
            case RentStatus.DECLINED: return "Abgelehnt"
            case RentStatus.RETURNED: return "Zurückgegeben"
        }
    }

    getColorOfStatus(status: RentStatus) {
        switch (status) {
            case RentStatus.CONFIRMED: return ColorEnum.GOOD
            case RentStatus.WAITING: return ColorEnum.MID
            case RentStatus.DECLINED: return ColorEnum.BAD
            default: return ColorEnum.GRAY
        }
    }

    openError(){

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
    checkAllSelects() {
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
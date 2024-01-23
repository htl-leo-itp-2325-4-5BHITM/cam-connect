import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListEntry.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"

@customElement('cc-rent-list-entry')
export class RentListEntryComponent extends LitElement {

    render() {
        return html`
            <style>${styles}</style>
            
            ${this.generateStudent()}
        `
    }

    generateStudent(){
        return html`
            ${this.generateHeading("Michael Leisch", "4BHITM")}
            <div class="entries">
                ${this.generateRent("CONFIRMED", "Lumix s5ii", "07.10", "24.10", "P. Engleitner")}
                ${this.generateRent("DECLINED", "Lumix s5ii", "07.10", "24.10", "P. Engleitner")}
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

    selectAll(elem) {
        elem.target.closest(".student").querySelectorAll(`cc-circle-select`).forEach(select => {
            select.setAttribute("checked", elem.target.getAttribute("checked"))
        })
    }

    generateRent(status, device, rent_start, rent_end_actual, teacher_start){
        return html`
            <div class="entry ${status}">
                <div>
                    <input type="text" value="${device}">
                    <input type="number" value="22">
                    <label for="">|</label>
                    <input type="text" class="customDate" pattern="\\d{2}-\\d{2}" value="${rent_start}"/>
                    <label for="" class="line">-</label>
                    <input type="text" class="customDate" pattern="\\d{2}-\\d{2}" value="${rent_end_actual}"/>
                    <label for="">|</label>

                    <div>
                        <p>Erstellt von: </p>
                        <p>${teacher_start}</p>
                    </div>
                </div>

                <div>
                    <cc-button color="${status == "DECLINED" ? ButtonColor.GRAY : ButtonColor.ACCENT}" type="${ButtonType.TEXT}">
                        Zurückgeben
                    </cc-button>
                    <cc-chip color="${status == "DECLINED" ? ColorEnum.BAD : ColorEnum.GOOD}">Abgelehnt</cc-chip>
                    <cc-circle-select></cc-circle-select>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-entry": RentListEntryComponent
    }
}
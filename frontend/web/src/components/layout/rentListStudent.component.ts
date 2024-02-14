import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListStudent.styles.scss'
import {CircleSelectType} from "../basic/circleSelect.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {RentByStudentDTO, RentStatus} from "../../service/rent.service";
import {model} from "../../index"
import {AppState, ObservedProperty} from "../../model"

@customElement('cc-rent-list-student')
export class RentListStudentComponent extends LitElement {
    @property()
    rentByStudent?: RentByStudentDTO

    @property({type: Boolean})
    appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        model.appState.subscribe(data => {
            this.autoCheckMultipleSelect()
        })
    }

    render() {
        let student = this.rentByStudent.student
        let rentList = this.rentByStudent.rentList

        return html`
            <style>${styles}</style>

            ${this.generateHeading(student.firstname + " " + student.lastname, student.school_class)}
            <div class="entries">
                ${rentList.map(rent => {
                    if(rent.status != RentStatus.RETURNED){
                        return html`<cc-rent-list-entry .rent="${rent}"></cc-rent-list-entry>`
                    }
                })}
            </div>`
    }

    generateHeading(name: string, schoolClass: string) {
        return html`
            <div class="heading">
                <div class="left">
                    <p class="bold">${name}</p>
                    <p>•</p>
                    <p>${schoolClass}</p>
                </div>
                <div class="right">
                    <cc-button size="${SizeEnum.SMALL}">Verleih erstellen</cc-button>
                    <cc-button color="${SimpleColorEnum.GRAY}" size="${SizeEnum.SMALL}">Details anzeigen</cc-button>
                    <cc-circle-select type="${CircleSelectType.MULTIPLE}" size="${SizeEnum.SMALL}" @click="${this.selectAll}"></cc-circle-select>
                </div>
            </div>
        `
    }

    selectAll(elem) {
        let targetCheck = elem.target.checked
        this.shadowRoot.querySelectorAll("cc-rent-list-entry").forEach(rentListEntry => {
            if(rentListEntry.checked != targetCheck){
                rentListEntry.toggleRentCheck()
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

        this.shadowRoot.querySelectorAll("cc-rent-list-entry").forEach(select => {
            if(select.checked != true){
                multiple.checked = false
            }
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-student": RentListStudentComponent
    }
}
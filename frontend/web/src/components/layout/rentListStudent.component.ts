import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListStudent.styles.scss'
import {CircleSelectType} from "../basic/circleSelect.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {RentByStudentDTO, RentStatusEnum} from "../../service/rent.service";
import {model} from "../../index"
import { ObservedProperty} from "../../model"
import {RentListEntryComponent} from "./rentListEntry.component"
import {ButtonType} from "../basic/button.component"
import {AppState} from "../../AppState"

@customElement('cc-rent-list-student')
export class RentListStudentComponent extends LitElement {
    @property()
    rentByStudent?: RentByStudentDTO

    constructor() {
        super()
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        model.appState.subscribe(data => {
            this.autoCheckSelectAll()
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
                    if(rent.status != RentStatusEnum.RETURNED){
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
                    <cc-button type="${ButtonType.OUTLINED}" size="${SizeEnum.SMALL}" @click="${() => model.appState.value.openCreateRentModal(this.rentByStudent.student.student_id)}">Verleih erstellen</cc-button>
                    <cc-button type="${ButtonType.TEXT}" color="${SimpleColorEnum.GRAY}" size="${SizeEnum.SMALL}">Details anzeigen</cc-button>
                    <cc-circle-select type="${CircleSelectType.MULTIPLE}" size="${SizeEnum.SMALL}" 
                                      .onToggle="${() => this.selectAll()}"
                    ></cc-circle-select>
                </div>
            </div>
        `
    }

    selectAll() {
        let isChecked = this.shadowRoot.querySelector("cc-circle-select").checked
        this.shadowRoot.querySelectorAll("cc-rent-list-entry").forEach(rentListEntry => {
            if(isChecked)
                rentListEntry.toggleRentCheck(true)
            else
                rentListEntry.toggleRentCheck(false)
        })
    }

    /**
     * this function checks if all rent entries of a student are selected or not
     * if so the multiple select gets checked as well
     */
    autoCheckSelectAll() {
        if (this.shadowRoot.querySelectorAll("cc-rent-list-entry").length == 0) return

        let multiple = this.shadowRoot.querySelector(`cc-circle-select`)
        multiple.checked = true

        this.shadowRoot.querySelectorAll("cc-rent-list-entry").forEach((entry: RentListEntryComponent) => {
            if(entry.isChecked() != true){
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
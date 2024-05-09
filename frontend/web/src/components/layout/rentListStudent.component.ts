import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentListStudent.styles.scss'
import {CircleSelectType} from "../basic/circleSelect.component"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {RentByStudentDTO, RentStatusEnum} from "../../service/rent.service";
import {model} from "../../index"
import {RentListEntryComponent} from "./rentListEntry.component"
import {ButtonType} from "../basic/button.component"
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

@customElement('cc-rent-list-student')
export class RentListStudentComponent extends LitElement {
    @property()
    rentByStudent?: RentByStudentDTO

    @property({type: Boolean, reflect: true})
    minimized: boolean = false

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
                <cc-button class="left"
                    .text="${html`
                        <p class="bold">${name}</p>
                        <p>•</p>
                        <p>${schoolClass}</p>`
                    }" 
                    type="${ButtonType.TEXT}"
                    @click="${this.toggleMinimization}"
                >
                    <div slot="left" class="icon">
                        ${unsafeSVG(icon(faCaretDown).html[0])}
                    </div>
                </cc-button>
                <div class="right">
                    <cc-button type="${ButtonType.OUTLINED}" size="${SizeEnum.SMALL}" 
                               @click="${() => model.appState.value.openCreateRentModal(this.rentByStudent.student.student_id)}"
                    >Verleih erstellen</cc-button>
                    <cc-button type="${ButtonType.TEXT}" color="${SimpleColorEnum.GRAY}" size="${SizeEnum.SMALL}" 
                               @click="${() => {model.appState.value.openOverlay()}}"
                    >Details anzeigen</cc-button>
                    
                    <cc-circle-select type="${CircleSelectType.MULTIPLE}" size="${SizeEnum.SMALL}" 
                                      .onToggle="${() => this.toggleSelectAll()}"
                    ></cc-circle-select>
                </div>
            </div>
        `
    }

    toggleSelectAll(overrideState?: boolean) {
        let isChecked = this.shadowRoot.querySelector("cc-circle-select").checked

        if(overrideState == isChecked) return //state is already the same
        else isChecked = overrideState

        this.toggleMinimization(false)
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

    fullHeight = -1
    toggleMinimization(overrideState?: boolean){
        if(overrideState == this.minimized) return

        let entryContainerElement = this.shadowRoot.querySelector(".entries") as HTMLElement
        if(this.minimized){ // expand the entries
            entryContainerElement.style.maxHeight = this.fullHeight + "px"
        }
        else{ //minimize the entries
            this.toggleSelectAll(false)

            //this approach is necessary because it's possible that a minimize is triggered while the animation is running which would result in a too small fullHeight value
            let entryElements = entryContainerElement.querySelectorAll("cc-rent-list-entry")
            this.fullHeight = entryElements[0].clientHeight * entryElements.length

            entryContainerElement.style.maxHeight = this.fullHeight + "px"
            setTimeout(() => {
                entryContainerElement.style.maxHeight = "0px"
            },)
        }

        this.minimized = !this.minimized
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-student": RentListStudentComponent
    }
}
import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentDetailView.styles.scss'
import RentService, {Rent, RentStatusEnum} from "../../service/rent.service"
import {Student} from "../../service/student.service"
import {ColorEnum, SimpleColorEnum} from "../../base"
import Util from "../../util"
import {ButtonType} from "../basic/button.component"
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {model} from "../../index"

interface chipProperty {
    color: ColorEnum
    text: string
}

@customElement('cc-rent-detail-view')
export class RentDetailViewComponent extends LitElement {
    @property()
    private studentId: number = -1

    @property() private student: Student

    @property()
    private rentList: Rent[] = []

    chipProperties: Map<RentStatusEnum, chipProperty>

    constructor() {
        super()
        this.chipProperties = new Map([
            [RentStatusEnum.RETURNED, {color: ColorEnum.ACCENT, text: "Zurückgegeben"}],
            [RentStatusEnum.WAITING, {color: ColorEnum.MID, text: "Warte auf Bestätigung"}],
            [RentStatusEnum.CONFIRMED, {color: ColorEnum.GOOD, text: "Bestätigt"}],
            [RentStatusEnum.DECLINED, {color: ColorEnum.BAD, text: "Abgelehnt"}],
            [RentStatusEnum.DELETED, {color: ColorEnum.GRAY, text: "Gelöscht"}],
        ])
    }

    connectedCallback() {
        super.connectedCallback();

        RentService.allRentsByStudent(this.studentId).then(rentList => {
            this.rentList = rentList[0].rentList || []
            this.student = rentList[0].student
        })
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <div class="header">
                <h2>Verleiheinträge von ${this.student?.firstname} ${this.student?.lastname}</h2>
                <cc-button 
                        type="${ButtonType.TEXT}" color="${ColorEnum.BAD}" 
                        text="schließen"
                        @click="${() => model.appState.value.closeOverlay()}"
                >
                    <div slot="left" class="icon bad">${unsafeSVG(icon(faXmark).html[0])}</div>
                </cc-button>
            </div>
            
            <div class="rent-container">
                ${this.rentList.map((rent:Rent, index) => html`
                    <div class="rent">
                        <div class="heading">
                            <h3>${rent.device.type.name}</h3>
                            <cc-chip color="${this.chipProperties.get(rent.status).color}" text="${this.chipProperties.get(rent.status)?.text}"></cc-chip>
                        </div>
                        <div class="row">
                            <cc-property-value property="Geräte Nr." value="${rent.device.number}"></cc-property-value>
                            <cc-property-value property="Erstellt am" value="${Util.formatDateTimeForHuman(rent.creation_date)}"></cc-property-value>
                            <cc-property-value property="Bearbeitet am" value="${Util.formatDateTimeForHuman(rent.change_date)}"></cc-property-value>
                        </div>
                        <h4>Ausleihung</h4>
                        <div class="row">
                            <cc-property-value property="Erstellt von" value="${rent.teacher_start.firstname} ${rent.teacher_start.lastname}"></cc-property-value>
                            <cc-property-value property="Datum" value="${Util.formatDateForHuman(rent.rent_start)}"></cc-property-value>
                        </div>
                        <h4>Rückgabe</h4>
                        <div class="row">
                            <cc-property-value property="Geplant" value="${Util.formatDateForHuman(rent.rent_end_planned)}"></cc-property-value>
                            ${ rent.status == RentStatusEnum.RETURNED ? html`
                                <cc-property-value property="Tatsächlich" value="${Util.formatDateForHuman(rent.rent_end_actual)}"></cc-property-value>
                                <cc-property-value property="Zurückgegeben von" value="${rent.teacher_end ? rent.teacher_end.firstname + ' ' + rent.teacher_end.lastname : 'unbekannt'}"></cc-property-value>
                            ` : html``}
                        </div>
                    </div>
                    
                    ${this.rentList[index+1] ? html`<cc-line></cc-line>` : ''}
                `)}
            </div>
            
            <div class="bottomBlur"></div>
            
            ${this.rentList.length == 0 ? html`<p>Lade Verleiheinträge..</p>` : ''}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-detail-view": RentDetailViewComponent
    }
}
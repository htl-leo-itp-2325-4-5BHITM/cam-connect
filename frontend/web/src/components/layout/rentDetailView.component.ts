import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentDetailView.styles.scss'
import {model} from "../../index";
import RentService, {Rent, RentByStudentDTO, RentStatusEnum} from "../../service/rent.service"
import {ObservedProperty} from "../../model"
import {Student} from "../../service/student.service"
import {ColorEnum, SimpleColorEnum} from "../../base"

interface chipProperty {
    color: ColorEnum
    text: string
}

@customElement('cc-rent-detail-view')
export class RentDetailViewComponent extends LitElement {
    @property()
    private student: Student

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

        console.log(this.student)

        RentService.allRentsByStudent(this.student.student_id).then(rentList => {
            this.rentList = rentList[0].rentList || []
        })
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <h3>Verleiheinträge von ${this.student.firstname} ${this.student.lastname}</h3>
            
            ${this.rentList.map((rent:Rent) => html`
                <div class="rent">
                    <p>${rent.device.type.name} • ${rent.device.number}</p>
                    <cc-chip color="${this.chipProperties.get(rent.status).color}" text="${this.chipProperties.get(rent.status)?.text}"></cc-chip>
                    <p>${rent.rent_start} - ${rent.rent_end_planned}</p>
                    <p></p>
                </div>
            `)}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-detail-view": RentDetailViewComponent
    }
}
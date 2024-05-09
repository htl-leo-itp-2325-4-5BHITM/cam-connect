import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import {model} from "../../index";
import RentService, {Rent, RentByStudentDTO, RentStatusEnum} from "../../service/rent.service"
import {ObservedProperty} from "../../model"
import {Student} from "../../service/student.service"

@customElement('cc-rent-detail-view')
export class RentDetailViewComponent extends LitElement {
    @property()
    private student: Student

    @property()
    private rentList: Rent[] = []
    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback();

        console.log(this.student)

        RentService.allRentsByStudent(this.student.student_id).then(rentList => {
            this.rentList = rentList[0].rentList || []
            console.log(this.rentList)
        })
    }

    render() {

        return html`
            <style>${styles}</style>
            
            ${this.rentList.map(rent => html`<p>${rent.device.number}</p>`)}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-detail-view": RentDetailViewComponent
    }
}
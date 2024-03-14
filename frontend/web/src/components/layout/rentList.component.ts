import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import {model} from "../../index";
import {RentByStudentDTO, RentStatus} from "../../service/rent.service"
import {ObservedProperty} from "../../model"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {
    @property()
    private rents: ObservedProperty<RentByStudentDTO[]>
    constructor() {
        super()
        this.rents = new ObservedProperty<RentByStudentDTO[]>(this, model.rents)
    }
    render() {
        return html`
            <style>${styles}</style>
            
            ${this.rents.value.map(rentByStudent => {
            if(rentByStudent.rentList.every(rent => rent.status == RentStatus.RETURNED)) return
            else return html`<cc-rent-list-student .rentByStudent="${rentByStudent}"></cc-rent-list-student>`
        })}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
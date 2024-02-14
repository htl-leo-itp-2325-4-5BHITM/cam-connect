import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import {model} from "../../index";
import {Rent, RentByStudentDTO} from "../../service/rent.service"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            
            ${model.rents.value.map(rentByStudent => {
                return html`<cc-rent-list-student .rentByStudent="${rentByStudent}"></cc-rent-list-student>`
            })}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
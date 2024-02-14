import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import {model} from "../../index";
import {Rent, RentByStudentDTO} from "../../service/rent.service"
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
        let count = 0;

        return html`
            <style>${styles}</style>
            
            ${this.rents.value.map(rent => {
                return html`<cc-rent-list-entry .rent="${rent}"></cc-rent-list-entry>`
            })}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
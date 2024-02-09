import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import {model} from "../../index";

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {
    render() {
        let count = 0;

        return html`
            <style>${styles}</style>
            
            ${model.rents.value.map(rent => {
                return this.generateStudent(count++)
            })}
        `
    }

    generateStudent(count: number){
        return html`
            <cc-rent-list-entry rentNumber="${count}"></cc-rent-list-entry>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
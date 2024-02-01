import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'
import {ButtonColor, ButtonComponent, ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {filter} from "rxjs"
import {ColorEnum} from "../../base"

@customElement('cc-create-rent')
export class CreateRentComponent extends LitElement {
    @property({type: Boolean})
    isOpen?: boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <div class="heading">
                <h2>Verleih erstellen</h2>
            </div>
            
            <cc-chip>Schüler auswählen • Klasse</cc-chip>
            
            <cc-line></cc-line>
            
            <div class="list">
                <div>
                    Globale Zeit setzen:
                    <div>
                        <input type="date">
                        <label for="" class="line">-</label>
                        <input type="date">
                    </div>
                </div>
                <cc-create-device-entry></cc-create-device-entry>
                <cc-create-device-entry></cc-create-device-entry>
                <cc-create-device-entry></cc-create-device-entry>
            </div>

            <cc-button color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}">
                Gerät Hinzufügen
            </cc-button>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent": CreateRentComponent
    }
}
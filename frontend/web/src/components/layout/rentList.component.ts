import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {

    render() {
        return html`
            <style>${styles}</style>
            
            <div class="devices">
                <div class="student">
                    ${this.generateHeading("Michael Leisch", "4BHITM")}
                </div>
            </div>
        `
    }

    generateHeading(name, classes) {
        return html`
            <div class="heading">
                <div class="leftSide">
                    <p>${name}</p>
                    <p>•</p>
                    <p>${classes}</p>
                </div>
                <div class="rightSide">
                    <cc-button>Verleih erstellen</cc-button>
                    <cc-button color="${ButtonColor.GRAY}">Details anzeigen</cc-button>
                    <cc-circle-select type="${CircleSelectType.MULTIPLE}"></cc-circle-select>
                </div>
            </div>
            <div class="entries">
                <div class="entry">
                    <div>
                        <input type="text" value="Lumix s5ii">
                        <input type="number" value="24">
                        <label for="">|</label>
                        <input type="time">
                        <label for="">-</label>
                        <input type="time">
                        <label for="">|</label>

                        <div>
                            <p>Erstellt von: </p>
                            <p>P. Engleitner</p>
                        </div>
                    </div>

                    <div>
                        <cc-button color="${ButtonColor.ACCENT}" type="${ButtonType.TEXT}">Zurückgeben</cc-button>
                        <cc-chip color="${ColorEnum.GOOD}">Bestätigt</cc-chip>
                        <cc-circle-select></cc-circle-select>
                    </div>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
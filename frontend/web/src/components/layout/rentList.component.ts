import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {ButtonColor} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {

    render() {
        return html`
            <style>${styles}</style>
            
            <div class="devices">
                <div class="student">
                    ${this.getHeading("Michael Leisch", "4BHITM")}
                </div>
            </div>
        `
    }

    getHeading(name, classes) {
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
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
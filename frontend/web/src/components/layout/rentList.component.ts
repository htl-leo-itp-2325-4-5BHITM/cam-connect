import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"
import {Rent, RentStatus} from "../../service/rent.service"
import {Device} from "../../service/device.service"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {

    render() {
        return html`
            <style>${styles}</style>
            
            ${this.generateStudent()}
        `
    }

    generateStudent(){
        return html`
            <cc-rent-list-entry></cc-rent-list-entry>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
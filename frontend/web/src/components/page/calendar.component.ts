import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/page/calendar.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"

@customElement('cc-calendar')
export class CalendarComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            
            <cc-toolbar page="${PageEnum.CALENDAR}"></cc-toolbar>
            <p>calendar page</p>
            <cc-chip type="expandable" text="chippy">
                <h3>hallo</h3>
                <p>welt</p>
            </cc-chip>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-calendar": CalendarComponent
    }
}
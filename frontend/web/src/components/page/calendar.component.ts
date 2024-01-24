import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"

@customElement('cc-calendar')
export class CalendarComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable"></cc-sidebar>
            <main>
                <cc-toolbar page="${PageEnum.CALENDAR}"></cc-toolbar>
                <p>calendar page</p>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-calendar": CalendarComponent
    }
}
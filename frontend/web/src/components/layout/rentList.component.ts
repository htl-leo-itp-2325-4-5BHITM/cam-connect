import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/rentList.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {

    render() {
        return html`
            <style>${styles}</style>
            <div class="toolbar">
                <div>
                    ${unsafeSVG(icon(faTrash).html[0])}
                    Auswahl aufheben
                </div>
                <div>
                    ${unsafeSVG(icon(faTrash).html[0])}
                    Löschen
                </div>
                <div>
                    ${unsafeSVG(icon(faTrash).html[0])}
                    Zurückgeben
                </div>
            </div>
            
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
                    <p class="bold">${name}</p>
                    <p>${classes}</p>
                </div>
                <div class="rightSide">
                    <cc-button>Verleih erstellen</cc-button>
                    <cc-button>Details anzeigen</cc-button>
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
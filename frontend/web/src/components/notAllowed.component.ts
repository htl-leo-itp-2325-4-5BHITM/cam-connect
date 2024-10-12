import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/notFound.styles.scss'
import UrlHandler from "../util/UrlHandler"
import {ButtonType} from "./basic/button.component"
@customElement('cc-not-allowed')
export class NotAllowed extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>Not allowed</h1>
                <p>You lack the needed permissions to access this page</p>
                <cc-button @click="${this.backToRentList}" type="${ButtonType.UNDERLINED}">Zurück zur Verleihliste</cc-button>
            </main>
        `
    }

    backToRentList(){
        UrlHandler.updateUrl("/")
        UrlHandler.parseCurrentURL()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-not-allowed": NotAllowed
    }
}
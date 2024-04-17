import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/notFound.styles.scss'
import URLHandler from "../urlHandler"
import {ButtonType} from "./basic/button.component"
@customElement('cc-not-found')
export class NotFoundComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>404</h1>
                <p>Page not found</p>
                <cc-button @click="${this.backToRentList}" type="${ButtonType.UNDERLINED}">Zurück zur Verleihliste
                </cc-button>
            </main>
        `
    }

    backToRentList(){
        URLHandler.updateUrl("/")
        URLHandler.parseCurrentURL()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-not-found": NotFoundComponent
    }
}
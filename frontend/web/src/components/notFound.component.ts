import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/notFound.styles.scss'
import URLHandler from "../urlHandler"
@customElement('cc-not-found')
export class NotFoundComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <h2>404</h2>
            <p>Page not found</p>
            <cc-button @click="${this.backToRentList}">Zurück zur Verleihliste
            </cc-button>
        `
    }

    backToRentList(){
        URLHandler.setUrl("/")
        URLHandler.parseCurrentURL()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-not-found": NotFoundComponent
    }
}
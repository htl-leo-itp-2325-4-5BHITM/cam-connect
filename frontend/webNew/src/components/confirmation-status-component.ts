import {html, render} from "lit-html"

import styles from '../../styles/components/confirmation-status.styles.scss'

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt"}

const confirmationStatus = (status: Status, isBig) => html`
    <div class="cc-confirmation-status" status="${status}" isBig="${isBig}">
        ${isBig ? status.toString() : ""}
    </div>`


class ConfirmationStatusComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"})

        const style = document.createElement('style');
        style.textContent = styles;
        shadow.appendChild(style)
    }
    connectedCallback() {
        this.render()
    }

    render() {
        const status = this.getAttribute('status') as Status
        const isBig = this.getAttribute('isBig')
        render(confirmationStatus(status, isBig), this.shadowRoot)
    }
}
customElements.define("cc-confirmation-status", ConfirmationStatusComponent)

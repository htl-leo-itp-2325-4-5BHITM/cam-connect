import {html, render} from "lit-html"

import styles from '../../styles/components/rent-status.styles.scss'

enum Status {VERFUEGBAR="verfügbar", VERGEBEN="vergeben", GESPERRT="gesperrt"}

const rentStatusComponent = (status: Status, amount) => html`
    <div class="cc-rent-status" status="${status}" amount="${amount}">
        ${amount} ${status.charAt(0).toUpperCase()}${status.substring(1,status.length)}
    </div>`


class RentStatusComponent extends HTMLElement {
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
        const amount = this.getAttribute('amount')

        render(rentStatusComponent(status, amount), this.shadowRoot)
    }
}
customElements.define("cc-rent-status", RentStatusComponent)

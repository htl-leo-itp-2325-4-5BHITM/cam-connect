import {html, render} from "lit-html"

import styles from '../../styles/components/rent-status.styles.scss'

enum Status {VERFUEGBAR="verfügbar", VERGEBEN="vergeben", GESPERRT="gesperrt"}

/**
 * @Param status: is "verfügbar", "vergeben" oder "gesperrt"
 * @Param amount: is the amount of status types
 */
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

        render(this.rentStatus(status, amount), this.shadowRoot)
    }

    rentStatus(status, amount) {
        let div = document.createElement('div')
        div.classList.add("cc-rent-status")
        div.setAttribute("status", status)
        div.setAttribute("amount", amount)
        div.innerHTML = `${amount ? amount : ""} ${status.charAt(0).toUpperCase()}${status.substring(1,status.length)}`
        return div
    }
}
customElements.define("cc-rent-status", RentStatusComponent)

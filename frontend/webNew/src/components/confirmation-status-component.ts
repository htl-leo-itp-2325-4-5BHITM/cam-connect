import {html, render} from "lit-html"

import styles from '../../styles/components/confirmation-status.styles.scss'

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt"}

class ConfirmationStatusComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"})

        const style = document.createElement('style')
        style.textContent = styles
        shadow.appendChild(style)
    }
    connectedCallback() {
        this.render()
    }

    render() {
        const status = this.getAttribute('status') as Status
        const isBig = this.getAttribute('isBig')
        render(this.confirmationStatus(status, isBig), this.shadowRoot)
    }
    
    confirmationStatus (status, isBig) {
        let div = document.createElement('div')
        div.classList.add("cc-confirmation-status")
        div.setAttribute("status", status)
        div.setAttribute("isBig", isBig)
        div.innerHTML = isBig ? status.toString() : ""

        return div
    }
}
customElements.define("cc-confirmation-status", ConfirmationStatusComponent)

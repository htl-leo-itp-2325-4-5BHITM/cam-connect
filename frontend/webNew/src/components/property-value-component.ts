import {html, render} from "lit-html"

import styles from '../../styles/components/property-value.styles.scss'

const rentStatus = (property, value) => html`
    <div>
        <p class="property">${property}:</p>
        <p class="value">${value}</p>
    </div>`


class PropertyValueComponent extends HTMLElement {
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
        const property = this.getAttribute("property")
        const value = this.getAttribute("value")
        render(rentStatus(property, value), this.shadowRoot)
    }
}
customElements.define("cc-property-value", PropertyValueComponent)

import {html, render} from "lit-html"

import styles from '../../styles/components/filter-option.styles.scss'

class FilterOptionComponent extends HTMLElement {
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
        render(, this.shadowRoot)
    }
}
customElements.define("cc-filter-option", FilterOptionComponent)

import {html, render} from "lit-html"

import styles from '../../styles/components/select.styles.scss'

class SelectComponent extends HTMLElement {
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
        render(this.select(), this.shadowRoot)
    }

    select() {
        const selectElements = this.querySelectorAll("cc-select-element")
        const div = document.createElement('div')
        div.setAttribute("class", "select")

        selectElements.forEach((elem) => {
            div.appendChild(elem)
        })
        return div
    }
}
customElements.define("cc-select", SelectComponent)

import {html, render} from "lit-html"

import styles from '../../styles/components/value-chain.styles.scss'

class ValueChainComponent extends HTMLElement {
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
        render(this.valueChain(), this.shadowRoot)
    }

    valueChain() {
        const selectElements = this.querySelectorAll("*")
        const div = document.createElement('div')
        div.setAttribute("class", "chain")

        selectElements.forEach((elem) => {
            div.appendChild(elem)
        })

        return div
    }
}
customElements.define("cc-value-chain", ValueChainComponent)

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
        const selectElements = this.querySelectorAll("*")
        const divBox = document.createElement('div')
        divBox.setAttribute("class", "chain")

        selectElements.forEach((elem) => {
            divBox.appendChild(elem)
        })

        this.shadowRoot.appendChild(divBox)
    }
}
customElements.define("cc-value-chain", ValueChainComponent)

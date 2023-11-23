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
        const selectElements = this.querySelectorAll("cc-select-element")
        const divBox = document.createElement('div')
        divBox.setAttribute("class", "select")

        selectElements.forEach((elem) => {
            divBox.appendChild(elem)
        })

        this.shadowRoot.appendChild(divBox)
    }
}
customElements.define("cc-select", SelectComponent)

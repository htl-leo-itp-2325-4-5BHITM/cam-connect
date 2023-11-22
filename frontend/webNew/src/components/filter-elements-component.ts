import styles from '../../styles/components/filter.styles.scss'

function toggleOption(elem) {
    elem.setAttribute("isActive", !this.getAttribute("isActive"))
}

class FilterElementsComponent extends HTMLElement {
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
        const div = document.createElement("div")
        div.setAttribute("class", `filter-element`)
        div.setAttribute("isActive", this.getAttribute("isActive"))
        div.setAttribute("onclick", "toggleOption(this)")

        const divLine = document.createElement('div')
        divLine.setAttribute("class", "line")
        const horLine = document.createElement('div')
        horLine.setAttribute("class", "horLine")
        const verLine = document.createElement("div")
        verLine.setAttribute("class", "verLine")
        divLine.appendChild(horLine)
        divLine.appendChild(verLine)

        const option = document.createElement("p")
        option.innerHTML = this.innerHTML

        div.appendChild(divLine)
        div.appendChild(option)
        this.shadowRoot.appendChild(div)
    }
}
customElements.define("cc-filter-element", FilterElementsComponent)

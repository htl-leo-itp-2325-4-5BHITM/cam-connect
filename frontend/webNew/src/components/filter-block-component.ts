import styles from '../../styles/components/filter.styles.scss'

class FilterBlockComponent extends HTMLElement {
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
        const filterElements = this.querySelectorAll("cc-filter-element")
        const divBox = document.createElement('div')
        divBox.setAttribute("class", "filter-block")
        const heading = document.createElement('h2')
        heading.innerHTML = this.getAttribute("name")

        divBox.appendChild(heading)
        filterElements.forEach((elem) => {
            divBox.appendChild(elem)
        })

        this.shadowRoot.appendChild(divBox)
    }
}
customElements.define("cc-filter-block", FilterBlockComponent)

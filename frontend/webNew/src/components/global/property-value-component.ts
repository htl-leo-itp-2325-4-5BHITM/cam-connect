import {html, render} from "lit-html"

import styles from '../../../styles/components/global/property-value.styles.scss'

/**
 * @Param property: is the text which comes first
 * @Param value: is the text which comes after the property
 */
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
        render(this.rentStatus(property, value), this.shadowRoot)
    }
    
    rentStatus(property, value) {
        let div = document.createElement('div')

        let propertyTag = document.createElement('p')
        propertyTag.classList.add("property")
        propertyTag.innerHTML = `${property}: `
        let valueTag = document.createElement('p')
        valueTag.classList.add("value")
        valueTag.innerHTML = value

        div.appendChild(propertyTag)
        div.appendChild(valueTag)
        return div
    }
}
customElements.define("cc-property-value", PropertyValueComponent)

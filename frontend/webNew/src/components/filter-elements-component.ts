import {html, render} from "lit-html"

class FilterElementsComponent extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
    }

    toggleOption() {
        const isActive = this.getAttribute("isActive") === 'true';
        this.setAttribute("isActive", (!isActive).toString());
    }
    render() {
        this.filterElement() // we're not appending it to the shadow root, so that we can style the element by the parent
    }

    filterElement() {
        const div = document.createElement("div")
        div.classList.add("filter-element")
        div.setAttribute("isActive", this.getAttribute("isActive"))
        div.addEventListener('click', this.toggleOption.bind(div))

        const option = document.createElement("p")
        option.innerHTML = this.innerHTML

        div.appendChild(option)
        this.innerHTML = ""
        this.appendChild(div)

        return div;
    }
}
customElements.define("cc-filter-element", FilterElementsComponent)

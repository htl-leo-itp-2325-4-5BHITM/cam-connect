import styles from '../../styles/components/circle-select.styles.scss'

enum Color {ACCENT="accent", GRAY="gray"}
enum Type {SINGLE="single", MULTIPLE="multiple"}

class CircleSelectComponent extends HTMLElement {
    constructor() {
        super()
        const style = document.createElement('style');
        style.textContent = styles;
        this.appendChild(style)
    }
    connectedCallback() {
        const color = this.getAttribute("color") as Color
        const type = this.getAttribute("type") as Type

        const div = document.createElement("div")
        div.classList.add(color)

        const image = document.createElement("img")
        image.src = `../../ressource/${div.classList.contains("active") ? "checked" : "unchecked"}_${type}.svg`
        div.addEventListener("click", this.swapCheckbox.bind(this, image, type))
        div.appendChild(image)

        this.appendChild(div)
    }

    swapCheckbox(image, type) {
        this.classList.toggle("active")
        image.src = `../../ressource/${this.classList.contains("active") ? "checked" : "unchecked"}_${type}.svg`
    }
}
customElements.define("cc-circle-select", CircleSelectComponent)

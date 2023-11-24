import {html, render} from "lit-html"
import styles from '../../styles/components/circle-select.styles.scss'

enum Color {ACCENT="accent", GRAY="gray"}
enum Type {SINGLE="single", MULTIPLE="multiple"}

/**
 * @Param color: accent or gray selector
 * @Param type: single or multiple selector
 */
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

        this.appendChild(this.circleSelect(color, type))
    }

    circleSelect(color, type) {
        const div = document.createElement("div")
        div.classList.add(color)

        const image = document.createElement("img")
        image.src = `../../resource/${div.classList.contains("active") ? "checked" : "unchecked"}_${type}.svg`
        div.addEventListener("click", this.swapCheckbox.bind(this, image, type))
        div.appendChild(image)

        return div
    }

    swapCheckbox(image, type) {
        this.classList.toggle("active")
        image.src = `../../resource/${this.classList.contains("active") ? "checked" : "unchecked"}_${type}.svg`
    }
}
customElements.define("cc-circle-select", CircleSelectComponent)
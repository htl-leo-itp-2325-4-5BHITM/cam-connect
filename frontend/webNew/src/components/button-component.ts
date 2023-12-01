import {html, render} from "lit-html"
import styles from '../../styles/components/button.styles.scss'

enum Size {MEDIUM="medium", SMALL="small"}
enum Type {FILLED="filled", OUTLINED="outlined"}
enum Color {ACCENT="accent", GRAY="gray"}

/**
 * @Param size: medium or small button
 * @Param type: filled or outlined button
 * @Param color: accent or gray button
 * @Param value: text content of the button
 */
class ButtonComponent extends HTMLElement {
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
        const size = this.getAttribute('size') as Size
        const type = this.getAttribute('type') as Type
        const color = this.getAttribute('color') as Color
        const value = this.innerHTML
        render(this.button(value, size, type, color), this.shadowRoot)
    }

    button (value, size, type, color) {
        let button = document.createElement("button")
        button.classList.add("cc-button")
        button.setAttribute("color", color || "accent")
        button.setAttribute("type", type || "filled")
        button.setAttribute("size", size || "medium")
        button.innerHTML = value || "Button"
        return button;
    }
}
customElements.define("cc-button", ButtonComponent)

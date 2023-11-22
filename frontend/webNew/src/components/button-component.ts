import {html, render} from "lit-html"

//@ts-ignore
import styles from '../../styles/components/button.styles.scss'

enum Size {MEDIUM="medium", SMALL="small"}
enum Type {FILLED="filled", OUTLINED="outlined"}
enum Color {ACCENT="accent", GRAY="gray"}

const button = (size: Size, type: Type, color: Color) => html`
    <button class="cc-button" color="${color}" type="${type}" size="${size}">
        Button
    </button>`


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
        render(button(size, type, color), this.shadowRoot)
    }
}
customElements.define("cc-button", ButtonComponent)

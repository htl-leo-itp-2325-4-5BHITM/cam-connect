import {html, render} from "lit-html"

import "../../styles/variables.scss"
import "../../styles/components/button.scss"

import styles from '../../styles/button.scss'

enum Size {MEDIUM="medium", SMALL="small"}
enum Type {FILLED="filled", OUTLINED="outlined"}
enum Color {ACCENT="accent", GRAY="gray"}

const host = document.querySelector("#host")

const sheet = new CSSStyleSheet()
sheet.replaceSync("button { color: red; }")

const button = (size: Size, type: Type, color: Color) => html`
<button part="cc-button" size="${size}" type="${type}" color="${color}"'>

    Button
</button>`

class ButtonComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = host.attachShadow({mode: "open"})
        shadow.adoptedStyleSheets = [sheet]
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

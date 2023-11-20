import {html, render} from "lit-html"

enum Size {MEDIUM="medium", SMALL="small"}
enum Type {FILLED="filled", OUTLINED="outlined"}
enum Color {ACCENT="accent", GRAY="gray"}

const button = (size: Size, type: Type, color: Color) => html`
<button class='${size.toString()}-button'>
    <h2>BUTTON</h2>
</button>`

class ButtonComponent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })

        const size = this.getSize()
        const type = this.getType()
        const color = this.getColor()

        render(button, shadow)
    }

    getSize() {
        return this.getAttribute('size')
    }
    getType() {
        return this.getAttribute('type')
    }
    getColor() {
        return this.getAttribute('color')
    }
}
customElements.define("cc-button", ButtonComponent)
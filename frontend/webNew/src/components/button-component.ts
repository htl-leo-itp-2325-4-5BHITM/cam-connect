import {html, render} from "lit-html"

import "../../styles/variables.scss"
import "../../styles/components/button.scss"

const styles = new CSSStyleSheet()
styles.replace('@import url("../../styles/components/button.scss");')

enum Size {MEDIUM="medium", SMALL="small"}
enum Type {FILLED="filled", OUTLINED="outlined"}
enum Color {ACCENT="accent", GRAY="gray"}

const button = (size: Size, type: Type, color: Color) => html`
<button class="cc-button" size="${size}" type="${type}" color="${color}"'>
    Button
</button>`

class ButtonComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.adoptedStyleSheets = [styles]
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

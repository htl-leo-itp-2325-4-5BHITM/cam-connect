import {html, render} from "lit-html"

import styles from '../../styles/components/circle-select.styles.scss'

enum Color {ACCENT="accent", GRAY="gray"}
enum Type {SINGLE="single", MULTIPLE="multiple"}

const circleSelect = (checked, color, type) => html`
    <img src="../../ressource/${checked.charAt(0) == "t" ? "checked" : "unchecked"}_${color}_${type}.svg">`

class CircleSelectComponent extends HTMLElement {
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
        const checked = this.getAttribute("checked")
        const color = this.getAttribute("color") as Color
        const type = this.getAttribute("type") as Type

        render(circleSelect(checked, color, type), this.shadowRoot)
    }
}
customElements.define("cc-circle-select", CircleSelectComponent)

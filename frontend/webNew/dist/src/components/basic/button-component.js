import { render } from "lit-html";
import styles from '../../../styles/components/basic/button.styles.scss';
var Size;
(function (Size) {
    Size["MEDIUM"] = "medium";
    Size["SMALL"] = "small";
})(Size || (Size = {}));
var Type;
(function (Type) {
    Type["FILLED"] = "filled";
    Type["OUTLINED"] = "outlined";
})(Type || (Type = {}));
var Color;
(function (Color) {
    Color["ACCENT"] = "accent";
    Color["GRAY"] = "gray";
})(Color || (Color = {}));
/**
 * @Param size: medium or small button
 * @Param type: filled or outlined button
 * @Param color: accent or gray button
 * @Param value: text content of the button
 */
class ButtonComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement('style');
        style.textContent = styles;
        shadow.appendChild(style);
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const size = this.getAttribute('size');
        const type = this.getAttribute('type');
        const color = this.getAttribute('color');
        const value = this.innerHTML;
        render(this.button(value, size, type, color), this.shadowRoot);
    }
    button(value, size, type, color) {
        let button = document.createElement("button");
        button.classList.add("cc-button");
        button.setAttribute("color", color || "accent");
        button.setAttribute("type", type || "filled");
        button.setAttribute("size", size || "medium");
        button.innerHTML = value || "Button";
        return button;
    }
}
customElements.define("cc-button", ButtonComponent);
//# sourceMappingURL=button-component.js.map
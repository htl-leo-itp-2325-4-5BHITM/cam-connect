import { render } from "lit-html";
import styles from '../../../styles/components/global/chip.styles.scss';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
var Color;
(function (Color) {
    Color["ACCENT"] = "accent";
    Color["GOOD"] = "good";
    Color["MID"] = "mid";
    Color["BAD"] = "bad";
    Color["GRAY"] = "gray";
})(Color || (Color = {}));
var Size;
(function (Size) {
    Size["SMALL"] = "small";
    Size["BIG"] = "big";
})(Size || (Size = {}));
/**
 * @Param status: is "verfügbar", "vergeben" oder "gesperrt"
 * @Param amount: is the amount of status types
 */
class ChipComponent extends HTMLElement {
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
    removeChip() {
        this.remove();
    }
    render() {
        const color = this.getAttribute('color');
        const size = this.getAttribute('size');
        const removeable = this.getAttribute('removeAble');
        const value = this.innerHTML || "Chip";
        render(this.chip(color, size, removeable, value), this.shadowRoot);
    }
    chip(color, size, removeable, value) {
        let div = document.createElement('div');
        div.classList.add("cc-chip");
        div.setAttribute("color", color || "ACCENT");
        div.setAttribute("size", size || "BIG");
        div.innerHTML = value;
        if (removeable) {
            let removeDiv = document.createElement('div');
            removeDiv.classList.add("removeDiv");
            removeDiv.innerHTML = icon(faXmark).html[0];
            removeDiv.addEventListener('click', this.removeChip.bind(div));
            div.appendChild(removeDiv);
        }
        return div;
    }
}
customElements.define("cc-chip", ChipComponent);
//# sourceMappingURL=chip-component.js.map
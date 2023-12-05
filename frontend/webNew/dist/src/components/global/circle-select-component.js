import styles from '../../../styles/components/global/circle-select.styles.scss';
var Color;
(function (Color) {
    Color["ACCENT"] = "accent";
    Color["GRAY"] = "gray";
})(Color || (Color = {}));
var Type;
(function (Type) {
    Type["SINGLE"] = "single";
    Type["MULTIPLE"] = "multiple";
})(Type || (Type = {}));
/**
 * @Param color: accent or gray selector
 * @Param type: single or multiple selector
 */
class CircleSelectComponent extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
        style.textContent = styles;
        this.appendChild(style);
    }
    connectedCallback() {
        const color = this.getAttribute("color");
        const type = this.getAttribute("type");
        this.appendChild(this.circleSelect(color, type));
    }
    circleSelect(color, type) {
        const div = document.createElement("div");
        div.classList.add(color || "accent");
        const image = document.createElement("img");
        image.src = `../../assets/${div.classList.contains("active") ? "checked" : "unchecked"}_${type || "single"}.svg`;
        div.addEventListener("click", this.swapCheckbox.bind(this, image, type));
        div.appendChild(image);
        return div;
    }
    swapCheckbox(image, type) {
        this.classList.toggle("active");
        image.src = `../../assets/${this.classList.contains("active") ? "checked" : "unchecked"}_${type || "single"}.svg`;
    }
}
customElements.define("cc-circle-select", CircleSelectComponent);
//# sourceMappingURL=circle-select-component.js.map
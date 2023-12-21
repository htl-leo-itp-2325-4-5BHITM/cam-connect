import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/button.styles.scss';
var Size;
(function (Size) {
    Size["MEDIUM"] = "big";
    Size["SMALL"] = "small";
    Size["XSMALL"] = "xsmall";
})(Size || (Size = {}));
var Type;
(function (Type) {
    Type["FILLED"] = "filled";
    Type["OUTLINED"] = "outlined";
    Type["TEXT"] = "text";
})(Type || (Type = {}));
var Color;
(function (Color) {
    Color["ACCENT"] = "accent";
    Color["GRAY"] = "gray";
})(Color || (Color = {}));
let ButtonComponent = class ButtonComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.size = Size.MEDIUM;
        this.type = Type.FILLED;
        this.color = Color.ACCENT;
        this.value = "Button";
    }
    render() {
        return html `
            <style>${styles}</style>
            <button class="cc-button" color="${this.color}" type="${this.type}" size="${this.size}">
                ${this.value}
            </button>`;
    }
};
__decorate([
    property({ type: Size })
], ButtonComponent.prototype, "size", void 0);
__decorate([
    property({ type: Type })
], ButtonComponent.prototype, "type", void 0);
__decorate([
    property({ type: Color })
], ButtonComponent.prototype, "color", void 0);
__decorate([
    property({ type: String })
], ButtonComponent.prototype, "value", void 0);
ButtonComponent = __decorate([
    customElement('cc-button')
], ButtonComponent);
export { ButtonComponent };
//# sourceMappingURL=button-component.js.map
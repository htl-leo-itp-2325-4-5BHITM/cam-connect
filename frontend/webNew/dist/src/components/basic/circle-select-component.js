import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/circle-select.styles.scss';
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
let CircleSelectComponent = class CircleSelectComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.color = Color.ACCENT;
        this.type = Type.SINGLE;
        this.checked = false;
    }
    toggleSelect() {
        this.checked = !this.checked;
    }
    render() {
        return html `
            <style>${styles}</style>
            <div @click="${this.toggleSelect}" class="${this.type == Type.MULTIPLE ? 'multiple' : ''} ${this.color}">
                <img src="../../assets/${this.checked ? "checked" : "unchecked"}_${this.type}.svg" alt="">\
            </div>`;
    }
};
__decorate([
    property({ type: Color })
], CircleSelectComponent.prototype, "color", void 0);
__decorate([
    property({ type: Type })
], CircleSelectComponent.prototype, "type", void 0);
__decorate([
    property({ type: Boolean })
], CircleSelectComponent.prototype, "checked", void 0);
CircleSelectComponent = __decorate([
    customElement('cc-circle-select')
], CircleSelectComponent);
export { CircleSelectComponent };
//# sourceMappingURL=circle-select-component.js.map
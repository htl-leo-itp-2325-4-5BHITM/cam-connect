import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/chip.styles.scss';
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
let ChipComponent = class ChipComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.color = Color.ACCENT;
        this.size = Size.BIG;
        this.removeable = false;
        this.value = "Chip";
    }
    render() {
        return html `
            <style>${styles}</style>
            <div class="cc-chip ${this.removeable ? 'removeDiv' : ''}" color="${this.color}" size="${this.size}"
                @click="${(e) => { e.target.remove(); }}">
                ${this.value}
                ${(this.removeable ? html `${icon(faXmark)}` : '')}
            </div>`;
        //todo fontawesome icon einfügen
    }
};
__decorate([
    property({ type: Color })
], ChipComponent.prototype, "color", void 0);
__decorate([
    property({ type: Size })
], ChipComponent.prototype, "size", void 0);
__decorate([
    property({ type: Boolean })
], ChipComponent.prototype, "removeable", void 0);
__decorate([
    property({ type: String })
], ChipComponent.prototype, "value", void 0);
ChipComponent = __decorate([
    customElement('cc-chip')
], ChipComponent);
export { ChipComponent };
//# sourceMappingURL=chip-component.js.map
import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/chip.styles.scss';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Fontawesome from 'lit-fontawesome';
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
        this.text = "Chip";
        this.test = icon(faXmark).html[0];
        this.testo = html `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><title>Replay</title><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"/></g></svg>`;
    }
    static get styles() {
        return [Fontawesome];
    }
    removeChip() {
        if (this.removeable === false)
            return;
        this.remove();
    }
    render() {
        return html `
            <style>${styles}</style>
            <div class="cc-chip ${this.removeable ? 'removeDiv' : ''}" color="${this.color}" size="${this.size}"
                @click="${this.removeChip}">
                ${this.text}
                ${this.removeable ? html `<span>&nbsp;x</span>` : ""}
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
], ChipComponent.prototype, "text", void 0);
ChipComponent = __decorate([
    customElement('cc-chip')
], ChipComponent);
export { ChipComponent };
//# sourceMappingURL=chip-component.js.map
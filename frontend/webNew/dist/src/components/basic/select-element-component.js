import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/select.styles.scss';
var Status;
(function (Status) {
    Status["CONFIRMED"] = "best\u00E4tigt";
    Status["WAITING"] = "warten";
    Status["DECLINED"] = "abgelehnt";
})(Status || (Status = {}));
let SelectElementComponent = class SelectElementComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.selected = false;
    }
    toggleOption(event) {
        const elem = event.currentTarget;
        console.log(elem);
        if (elem.closest(".select")) { //todo i don't really know how to get out of the shadow root
            const select = elem.closest(".select");
            const activeElement = select.querySelector(".active");
            if (activeElement) {
                activeElement.classList.remove("active");
            }
        }
        event.target.classList.add("active");
    }
    render() {
        return html `
            <style>${styles}</style>
            <div class="select-element ${this.selected ? "active" : ""}" @click="${this.toggleOption}">
                <p>${this.innerHTML}</p>
            </div>`;
    }
};
__decorate([
    property({ type: Boolean })
], SelectElementComponent.prototype, "selected", void 0);
SelectElementComponent = __decorate([
    customElement('cc-select-element')
], SelectElementComponent);
export { SelectElementComponent };
//# sourceMappingURL=select-element-component.js.map
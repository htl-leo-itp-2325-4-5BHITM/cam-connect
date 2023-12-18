import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/confirmation-status.styles.scss';
var Status;
(function (Status) {
    Status["CONFIRMED"] = "best\u00E4tigt";
    Status["WAITING"] = "warten";
    Status["DECLINED"] = "abgelehnt";
    Status["RETURNED"] = "zur\u00FCckgegeben";
})(Status || (Status = {}));
let ConfirmationStatusComponent = class ConfirmationStatusComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.status = Status.WAITING;
        this.isBig = false;
    }
    render() {
        return html `
            <style>${styles}</style>
            <div class="cc-confirmation-status" status="${this.status}" isBig="${this.isBig}">
                ${this.isBig ? this.status.toString() : ""}
            </div>`;
    }
};
__decorate([
    property({ type: Status })
], ConfirmationStatusComponent.prototype, "status", void 0);
__decorate([
    property({ type: Boolean })
], ConfirmationStatusComponent.prototype, "isBig", void 0);
ConfirmationStatusComponent = __decorate([
    customElement('cc-confirmation-status')
], ConfirmationStatusComponent);
export { ConfirmationStatusComponent };
//# sourceMappingURL=confirmation-status-component.js.map
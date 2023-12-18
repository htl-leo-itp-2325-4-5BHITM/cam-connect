import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/property-value.styles.scss';
var Status;
(function (Status) {
    Status["CONFIRMED"] = "best\u00E4tigt";
    Status["WAITING"] = "warten";
    Status["DECLINED"] = "abgelehnt";
})(Status || (Status = {}));
let PropertyValueComponent = class PropertyValueComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.property = 'Property';
        this.value = 'Value';
    }
    render() {
        return html `
            <style>${styles}</style>
            <div>
                <p class="property">${this.property}:</p>
                <p class="value">${this.value}</p>
            </div>`;
    }
};
__decorate([
    property({ type: String })
], PropertyValueComponent.prototype, "property", void 0);
__decorate([
    property({ type: String })
], PropertyValueComponent.prototype, "value", void 0);
PropertyValueComponent = __decorate([
    customElement('cc-property-value')
], PropertyValueComponent);
export { PropertyValueComponent };
//# sourceMappingURL=property-value-component.js.map
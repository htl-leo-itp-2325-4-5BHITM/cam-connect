import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/property-value.styles.scss';
var Size;
(function (Size) {
    Size[Size["BIG"] = 0] = "BIG";
    Size[Size["SMALL"] = 1] = "SMALL";
})(Size || (Size = {}));
let PropertyValueComponent = class PropertyValueComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.property = 'Property';
        this.value = 'Value';
        this.size = Size.BIG;
        this.isLink = false;
    }
    render() {
        return html `
            <style>${styles}</style>
            <div size="${this.size}" isLink="${this.isLink}">
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
__decorate([
    property({ type: Size })
], PropertyValueComponent.prototype, "size", void 0);
__decorate([
    property({ type: Boolean })
], PropertyValueComponent.prototype, "isLink", void 0);
PropertyValueComponent = __decorate([
    customElement('cc-property-value')
], PropertyValueComponent);
export { PropertyValueComponent };
//# sourceMappingURL=property-value-component.js.map
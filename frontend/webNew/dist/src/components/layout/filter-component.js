import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/layout/filter.styles.scss';
let FilterComponent = class FilterComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.accountname = 'No username provided';
    }
    // Render the UI as a function of component state
    render() {
        return html `
            <style>${styles}</style>
            <div>
                <p>filter sidebar</p>
                <slot></slot>
            </div>
        `;
    }
};
__decorate([
    property({ type: String })
], FilterComponent.prototype, "accountname", void 0);
FilterComponent = __decorate([
    customElement('cc-filter')
], FilterComponent);
export { FilterComponent };
//# sourceMappingURL=filter-component.js.map
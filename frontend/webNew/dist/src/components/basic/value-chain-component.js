import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/value-chain.styles.scss';
let ValueChainComponent = class ValueChainComponent extends LitElement {
    render() {
        const selectElements = Array.from(this.querySelectorAll('*'));
        return html `
            <style>${styles}</style>
            <div class="chain">
                ${selectElements.map((value) => html `${value}`)}
            </div>`;
    }
};
ValueChainComponent = __decorate([
    customElement('cc-value-chain')
], ValueChainComponent);
export { ValueChainComponent };
//# sourceMappingURL=value-chain-component.js.map
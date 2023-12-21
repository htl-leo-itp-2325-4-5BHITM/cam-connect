import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/select.styles.scss';
let SelectComponent = class SelectComponent extends LitElement {
    render() {
        const selectElements = Array.from(this.querySelectorAll('cc-select-element'));
        return html `
            <style>${styles}</style>
            <div class="select">
                ${selectElements.map((value) => html `${value}`)}
            </div>`;
    }
};
SelectComponent = __decorate([
    customElement('cc-select')
], SelectComponent);
export { SelectComponent };
//# sourceMappingURL=select-component.js.map
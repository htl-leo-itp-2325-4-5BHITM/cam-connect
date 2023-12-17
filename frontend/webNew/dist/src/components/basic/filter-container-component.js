import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../../../styles/components/basic/filter-container.styles.scss';
let FilterContainerComponent = class FilterContainerComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.name = 'Filterblock';
    }
    /**
     * handles the users click ona filter option, highlights it and //TODO passes it back to the index.js
     * @param e
     * @param option
     */
    selectOption(e, option) {
        option.selected = !option.selected;
        let elem = e.target;
        elem.classList.toggle("selected");
    }
    render() {
        return html `
            <style>${styles}</style>
            <div class="filter-block">
                <p class="heading">${this.name}</p>
                ${this.options.map((option) => //loop over all options and map(return/create) an item for each
         html `<p class="option" @click="${(e) => { this.selectOption(e, option); }}">${option.name}</p>`)}
            </div>`;
    }
};
__decorate([
    property()
], FilterContainerComponent.prototype, "name", void 0);
__decorate([
    property()
], FilterContainerComponent.prototype, "options", void 0);
FilterContainerComponent = __decorate([
    customElement('cc-filter-container')
], FilterContainerComponent);
export { FilterContainerComponent };
//# sourceMappingURL=filter-container-component.js.map
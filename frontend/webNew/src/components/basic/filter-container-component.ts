import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/filter-container.styles.scss'

@customElement('cc-filter-container')
export class FilterContainerComponent extends LitElement {
    @property()
    name?: string = 'Filterblock';

    @property()
    options?;

    /**
     * handles the users click on filter option, highlights it and //TODO passes it back to the index.js
     * @param e Click event
     * @param option reference to the selected option
     */
    selectOption(e:Event, option){
        option.selected = !option.selected
        let elem = e.target as HTMLParagraphElement
        elem.classList.toggle("selected")
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="filter-block">
                <p class="heading">${this.name}</p>
                ${this.options.map((option) => //loop over all options and map(return/create) an item for each
                        html`<p class="option" @click="${(e:Event) => {this.selectOption(e, option)}}">${option.name}</p>`
                )}
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-container": FilterContainerComponent;
    }
}
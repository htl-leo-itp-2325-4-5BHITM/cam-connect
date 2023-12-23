import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/filter-container.styles.scss'
import Model, {ObservedProperty} from "../../model"

export enum FilterOptionType {
    DeviceType,
}

export interface FilterOption {
    name: string,
    selected?: boolean,
    type: FilterOptionType,
    id: number
}

@customElement('cc-filter-container')
export class FilterContainerComponent extends LitElement {
    @property({type: String})
    name?: string = 'Filterblock'

    @property()
    options?: ObservedProperty<FilterOption[]>

    constructor(name: string) {
        super()
        this.name = name
    }

    /**
     * handles the users click on a filter option, highlights it and //TODO passes it back to the index.js
     * @param e
     * @param option
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
                ${this.options?.value?.map((option) => //loop over all options and map(return/create) an item for each
                        html`<p class="option" @click="${(e:Event) => {this.selectOption(e, option)}}">${option.name}</p>`
                )}
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-container": FilterContainerComponent
    }
}
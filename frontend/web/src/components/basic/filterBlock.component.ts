import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/filterBlock.styles.scss'
import Model, {ObservedProperty} from "../../model"
import {Tooltip} from "../../base"

export interface FilterOption {
    name: string,
    details?: string
    selected?: boolean,
    id: (number | string)
}

@customElement('cc-filter-container')
export class FilterBlockComponent extends LitElement {
    @property({type: String})
    name?: string = 'Filterblock'

    @property()
    options?: ObservedProperty<FilterOption[]>

    @property()
    selectOptionsUpdated: (options: FilterOption[]) => void = () => {}

    constructor(name: string) {
        super()
        this.name = name
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="filter-block">
                <p class="heading">${this.name}<span class="clear" @click="${this.clearSelection}">löschen</span></p>
                ${this.options?.value?.map((option) => //loop over all options and map(return/create) a select option for each
                        html`<p class="option ${option.selected ? 'selected' : ''}" 
                                @click="${(e:Event) => {this.selectOption(e, option); Tooltip.hide(0, true)}}"
                                @mouseenter="${(e:Event) => {Tooltip.show(e.target as HTMLElement, option.details, 1000)}}"
                                @mouseleave="${()=>{Tooltip.hide(0)}}"
                        >${option.name}</p>`
                )}
            </div>`
    }

    /**
     * handles the users click on a filter option, highlights it and passes it back to the index.js
     * @param e
     * @param option
     */
    selectOption(e:Event, option:FilterOption){
        option.selected = !option.selected
        this.selectOptionsUpdated(this.options.value)
        this.requestUpdate()
    }

    clearSelection(){
        this.options.value.forEach(option => {
            option.selected = false
        })
        this.selectOptionsUpdated(this.options.value)
        this.requestUpdate()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-block": FilterBlockComponent
    }
}
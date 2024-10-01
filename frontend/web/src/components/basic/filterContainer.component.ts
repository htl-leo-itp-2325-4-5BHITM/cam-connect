import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/filterContainer.styles.scss'
import Model, {ObservedProperty} from "../../model"
import {Observable} from "rxjs"
import {Tooltip} from "../../util/Tooltip"

export interface FilterOption {
    name: string,
    details?: string
    selected?: boolean,
    id: (string | number)
}

@customElement('cc-filter-container')
export class FilterContainerComponent extends LitElement {
    name: string = this.innerHTML
    visibility: string[] = []

    @property()
    options?: Observable<FilterOption[]>
    private theOptions: ObservedProperty<FilterOption[]>

    @property()
    onUpdate: (options: FilterOption[]) => void = () => {}

    @property()
    filterChange: () => void = () => {}

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback();
        this.theOptions = new ObservedProperty<FilterOption[]>(this, this.options)
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="filter-block">
                <p class="heading">${this.name}<span class="clear" @click="${this.clearSelection}">löschen</span></p>
                ${this.theOptions?.value?.map((option) => { //loop over all options and map(return/create) a select option for each
                    if(option.details)
                        return html`<p class="option ${option.selected ? 'selected' : ''}" 
                            @click="${(e: Event) => {
                                this.toggleOption(e, option)
                                Tooltip.hide(0, true)
                            }}"
                            @mouseenter="${(e: Event) => {
                                Tooltip.show(e.target as HTMLElement, option.details, 1000)
                            }}"
                            @mouseleave="${() => {
                                Tooltip.hide(0)
                            }}"
                        >${option.name}</p>`
                    else
                        return html`<p class="option ${option.selected ? 'selected' : ''}" 
                            @click="${(e: Event) => {
                                this.toggleOption(e, option)
                            }
                        }"
                        >${option.name}</p>`
                    }
                )}
            </div>`
    }

    /**
     * handles the users click on a filter option, highlights it and passes it back
     * @param e
     * @param option
     */
    toggleOption(e:Event, option:FilterOption){
        if(!this.theOptions.value.includes(option)) return
        option.selected = !option.selected
        this.onUpdate(this.theOptions.value)
        this.filterChange()
        this.requestUpdate()
    }

    selectOptionById(id: string | number){
        let option = this.theOptions.value.find(option => option.id == id)
        if(option) {
            option.selected = true
            this.onUpdate(this.theOptions.value)
            this.filterChange()
            this.requestUpdate()
        }
    }

    getSelectedOptionsAsIdArray():(string | number)[] {
        let optionsAsIdArray:(string | number)[] = []
        this.theOptions.value.forEach(option => {
            if(option.selected) optionsAsIdArray.push(option.id)
        })
        return optionsAsIdArray
    }

    clearSelection(){
        this.clearVisibleSelection()
        this.onUpdate(this.theOptions.value)
    }

    clearVisibleSelection(){
        this.theOptions.value.forEach(option => {
            option.selected = false
        })

        this.requestUpdate()

        this.filterChange()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-container": FilterContainerComponent
    }
}
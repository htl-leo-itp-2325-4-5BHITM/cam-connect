import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export interface AutocompleteOption {
    id: number
    name: string
    type?: string
}

@customElement('cc-autocomplete')
export class AutocompleteComponent extends LitElement {
    @property({type: String})
    placeholder?: String = ""

    @property({type: Boolean})
    disabled?: boolean = false

    @property()
    selected: string = ""

    @property()
    options: AutocompleteOption[] = []

    @property()
    onSelect = (id: number) => {}

    @property()
    querySuggestions: (searchTerm: string) => Promise<AutocompleteOption[]>

    render() {
        return html`
            <style>${styles}</style>
            <input type="text" placeholder="${this.placeholder}" .disabled="${this.disabled}" 
                   @focus="${this.showSuggestions}"
                   @keyup="${this.getSuggestions}"
            >
            <div class="suggestions">
                ${this.options.map(option => {
                    return html`
                        <div class="entry" @click="${()=>this.selectSuggestion(option.id)}">
                            ${unsafeSVG(icon(faCamera).html[0])}
                            <label>${option.name}</label>
                        </div>
                    `
                })}
            </div>
        `
    }

    showSuggestions(){
        let input = this.shadowRoot.querySelector('input') as HTMLInputElement
        input.select()

        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.style.display = "flex"
        setTimeout(() => {
            suggestionElem.classList.add("visible")
        },)
    }

    hideSuggestions(){
        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.classList.remove("visible")
        setTimeout(() => {
            suggestionElem.style.display = "none"
        },200)
    }

    selectSuggestion(id:number){
        console.log("selected", id)
        this.shadowRoot.querySelector("input").value = this.options.find(option => option.id == id).name
        this.hideSuggestions()
    }

    getSuggestions(){
        console.log("getting suggestions")
        let input = this.shadowRoot.querySelector("input") as HTMLInputElement
        let searchTerm = input.value
        this.querySuggestions(searchTerm)
            .then(options => {
                this.options = options
            })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent;
    }
}

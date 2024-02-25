import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
@customElement('cc-autocomplete')
export class AutocompleteComponent extends LitElement {
    @property({type: String})
    placeholder?: String = this.innerText || ""

    @property({type: Boolean})
    disabled?: boolean = false

    @property()
    selected: string = ""

    render() {
        return html`
            <style>${styles}</style>
            <input type="text" placeholder="${this.placeholder}" .disabled="${this.disabled}" 
                   @focus="${this.showSuggestions}"
                   @blur="${this.hideSuggestions}"
            >
            <div class="suggestions">
                <div class="entry" @click="">
                    ${unsafeSVG(icon(faCamera).html[0])}
                    <label>Lumix S5ii</label>
                </div>
                <div class="entry">
                    ${unsafeSVG(icon(faCamera).html[0])}
                    <label>Lumix S5ii</label>
                </div>
            </div>
        `
    }

    showSuggestions(){
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

    selectSuggestion(){
        this.hideSuggestions()
        console.log("selecting suggestion")
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent;
    }
}

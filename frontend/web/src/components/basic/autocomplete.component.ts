import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import Util from "../../util"
import {KeyBoardShortCut, Regex} from "../../base"
import {model} from "../../index"

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
    selected: number = -1

    @property()
    options: AutocompleteOption[] = []

    @property()
    onSelect = (id: number) => {}

    @property()
    querySuggestions: (searchTerm: string) => Promise<AutocompleteOption[]>

    focusedId: number = -1

    render() {
        return html`
            <style>${styles}</style>
            <input type="text" placeholder="${this.placeholder}" .disabled="${this.disabled}" value=""
                   @click="${this.showSuggestions}"
                   @keyup="${this.generateSuggestions}"
                   @blur="${this.handleAutoClose}"
            >
            <div class="suggestions">
                ${this.options.map(option => {
                    return html`
                        <div class="entry" @click="${()=>this.selectSuggestion(option.id)}" 
                             @mouseenter="${(e: Event) => {this.focusEntry(e.target as HTMLElement)}}"
                             data-id="${option.id}"
                        >
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
        this.generateSuggestions()

        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.style.display = "flex"
        setTimeout(() => {
            suggestionElem.classList.add("visible")
        },)

        document.addEventListener("click", this.boundHandelAutoClose)

        KeyBoardShortCut.register(["ArrowUp"], () => this.moveFocus("up"), "autocomplete", true)
        KeyBoardShortCut.register(["ArrowDown"], () => this.moveFocus("down"), "autocomplete", true)
        KeyBoardShortCut.register(["Enter"], () => {this.selectSuggestion(this.focusedId)}, "autocomplete", true)
        KeyBoardShortCut.register(["Escape"], () => {this.hideSuggestions()}, "autocomplete", true)
    }

    hideSuggestions(){
        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.classList.remove("visible")
        setTimeout(() => {
            suggestionElem.style.display = "none"
        },200)

        let input = this.shadowRoot.querySelector("input")
        console.log(this.selected)
        if(this.selected > -1) {
            console.log(Object.values(model.deviceTypes.value).flat())
            input.value = Object.values(model.deviceTypes.value).flat().find(deviceType => deviceType.type_id == this.selected).name
        }
        else
            input.value = ""

        //input.blur()

        document.removeEventListener("click", this.boundHandelAutoClose)

        KeyBoardShortCut.remove("autocomplete")
    }

    selectSuggestion(id:number){
        console.log("selecting", id)
        if(!id || id < 0) return
        this.selected = id
        this.shadowRoot.querySelector("input").focus()
        this.hideSuggestions()
    }

    generateSuggestions(e?: KeyboardEvent){
        let input = this.shadowRoot.querySelector("input") as HTMLInputElement
        if(e) {
            if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Enter") return
        }
        let searchTerm = input.value
        this.querySuggestions(searchTerm)
            .then(options => {
                this.options = options
            })
            .then(() => {
                this.focusEntry(this.shadowRoot.querySelector(".entry") as HTMLElement)
            })
    }

    boundHandelAutoClose = this.handleAutoClose.bind(this)
    handleAutoClose(e: Event){
        let target = Util.deepEventTarget()
        if (target == this.shadowRoot.querySelector("input") ||
            target == this.shadowRoot.querySelector(".suggestions")) {
            return
        }
        this.hideSuggestions()
    }

    focusEntry(entry: HTMLElement){
        if(!entry) {
            this.focusedId = -1
            return
        }
        this.shadowRoot.querySelectorAll(".entry.focused")
            .forEach(entry => entry.classList.remove("focused"))
        entry?.classList.add("focused")
        this.focusedId = Number(entry.dataset.id)
    }

    moveFocus(direction: "up" | "down"){
        let focused = this.shadowRoot.querySelector(".entry.focused") as HTMLElement
        focused.classList.remove("focused")

        let next: HTMLElement
        if(direction == "up"){
            next = focused?.previousElementSibling as HTMLElement
            if(next == null) next = this.shadowRoot.querySelector(".entry:last-of-type")
        }
        else if(direction == "down"){
            next = focused?.nextElementSibling as HTMLElement
            if(next == null) next = this.shadowRoot.querySelector(".entry:first-of-type")
        }
        next.classList.add("focused")
        this.focusedId = Number(next.dataset.id)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent;
    }
}

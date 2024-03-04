import {LitElement, html, PropertyValues, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import Util from "../../util"
import {KeyBoardShortCut, Regex, SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCaretDown} from "@fortawesome/free-solid-svg-icons"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"

export interface AutocompleteOption<T> {
    id: number
    data: T
}

@customElement('cc-autocomplete')
export class AutocompleteComponent<T> extends LitElement {
    @property({type: String})
    placeholder?: String = ""

    @property({type: Boolean})
    disabled?: boolean = false

    @property({reflect: true})
    color: SimpleColorEnum = SimpleColorEnum.GRAY

    @property()
    size: SizeEnum = SizeEnum.SMALL

    @property()
    selected: AutocompleteOption<T> = {id: -1, data: null}

    @property()
    options: AutocompleteOption<T>[] = []

    @property()
    onSelect = (option: T) => {}

    @property()
    querySuggestions: (searchTerm: string) => Promise<AutocompleteOption<T>[]> = (searchTerm) => {return Promise.resolve([])}

    @property()
    iconProvider: (data: T) => TemplateResult = (data) => {return html`no icon provider`}

    @property()
    contentProvider: (data: T) => string = () => {return "no content provider"}

    private focusedId: number = -1

    private suggestionsVisible: boolean = false

    @property()
    appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <input type="text" placeholder="${this.placeholder}" .disabled="${this.disabled}" value=""
                   @focus="${(e)=>{e.target.select()}}"
                   @click="${()=>{this.showSuggestions(); this.generateSuggestions()}}"
                   @keyup="${this.generateSuggestions}"
                   @blur="${this.handleAutoClose}"
            >
            ${this.clientWidth > 50 ? unsafeSVG(icon(faCaretDown).html[0]) : html``}
            <div class="suggestions">
                ${
                    this.options.length == 0 ? html`<div class="empty">Keine Ergebnisse</div>` :
                    this.options.map(option => {
                        return html`
                            <div class="entry" 
                                 @click="${()=> {this.selectSuggestion(option)}}" 
                                 @mouseenter="${(e: Event) => {this.focusEntry(e.target as HTMLElement)}}"
                                 data-id="${option.id}"
                            >
                                ${this.iconProvider(option.data)}
                                <label>${this.contentProvider(option.data)}</label>
                            </div>
                        `
                    })
                }
            </div>
        `
    }

    showSuggestions(){
        this.suggestionsVisible = true

        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.style.display = "flex"
        setTimeout(() => {
            suggestionElem.classList.add("visible")
        },)

        document.addEventListener("click", this.boundHandelAutoClose)

        KeyBoardShortCut.register(["ArrowUp"], () => this.moveFocus("up"), "autocomplete", true)
        KeyBoardShortCut.register(["ArrowDown"], () => this.moveFocus("down"), "autocomplete", true)
        KeyBoardShortCut.register(["Enter"], () => {this.selectSuggestion(this.options.find(option => option.id = this.focusedId))}, "autocomplete", true)
        this.appState.value.addCurrentActionCancellation(() => {this.hideSuggestions()}, "autocomplete")
    }

    hideSuggestions(){
        this.suggestionsVisible = false

        let suggestionElem = this.shadowRoot.querySelector(".suggestions") as HTMLElement
        suggestionElem.classList.remove("visible")
        setTimeout(() => {
            suggestionElem.style.display = "none"
        },200)

        let input = this.shadowRoot.querySelector("input")
        if(this.selected.id > -1) {
            input.value = this.contentProvider(this.selected.data)
        }
        else
            input.value = ""

        //input.blur()

        document.removeEventListener("click", this.boundHandelAutoClose)

        KeyBoardShortCut.remove("autocomplete")
        this.appState.value.removeCurrentActionCancellation("autocomplete")
    }

    selectSuggestion(option: AutocompleteOption<T>){
        console.log("selcting", option)
        if(!option || option.id < 0) return
        this.selected = option
        this.shadowRoot.querySelector("input").focus()
        this.hideSuggestions()
        this.onSelect(this.selected.data)
    }

    //TODO we might want to limit rates here so that we dont send all too many requests
    generateSuggestions(e?: KeyboardEvent){
        //TODO display selected suggestion on first focus

        let input = this.shadowRoot.querySelector("input") as HTMLInputElement
        if(e) {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Alt", "Control", "Escape"].includes(e.key)) return
        }

        if(!this.suggestionsVisible) this.showSuggestions()

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
        //TODO target is the body for some reason so clicking the padding of the suggestion box closes it
        let target = Util.deepEventFocusedElement(this)
        if (target == this.shadowRoot.querySelector("input") ||
            target == this.shadowRoot.querySelector(".suggestions") ||
            target.classList.contains("entry"))
        {
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

        console.log(next, this.focusedId)
    }

    //region outside interaction
    setFocus(){
        this.shadowRoot.querySelector("input").focus()
        this.generateSuggestions()
    }

    clear(){
        this.selected = {id: -1, data: null}
        this.shadowRoot.querySelector("input").value = ""
    }
    //endregion
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent<any>;
    }
}

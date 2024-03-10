 import {LitElement, html, PropertyValues, TemplateResult, render} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import Util, {AnimationHelper} from "../../util"
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

    static suggestionElement: HTMLElement

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)

        if(AutocompleteComponent.suggestionElement) return
        AutocompleteComponent.suggestionElement = model.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions") as HTMLElement
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.selectSuggestion(this.selected)
    }

    render() {
        render(html`${
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
            }`,
            AutocompleteComponent.suggestionElement)

        return html`
            <style>${styles}</style>
            <input type="text" placeholder="${this.placeholder}" .disabled="${this.disabled}" data-role="autocompleteInput" value="${this.selected.id > -1 ? this.contentProvider(this.selected.data) : ""}"
                   @focus="${(e)=>{}}"
                   @click="${(e)=>{e.target.select(); this.showSuggestions(); this.generateSuggestions()}}"
                   @keyup="${this.generateSuggestions}"
                   @blur="${this.handleAutoClose}"
            >
            ${this.clientWidth > 50 || this.selected.id < 0 ? unsafeSVG(icon(faCaretDown).html[0]) : html``}
        `
    }

    showSuggestions(){
        this.suggestionsVisible = true

        let input = this.shadowRoot.querySelector("input")
        let inputBounds = input.getBoundingClientRect()
        AutocompleteComponent.suggestionElement.style.left = inputBounds.left + "px"

        this.updateSuggestionPosition()

        //TODO these are not working properyl and seem to impact performance significantly
        /*document.addEventListener("mousewheel", this.boundUpdateSuggestionPosition);
        document.addEventListener("touchmove", this.boundUpdateSuggestionPosition);*/

        setTimeout(() => {
            AutocompleteComponent.suggestionElement.classList.add("visible")
        },)

        document.addEventListener("click", this.boundHandelAutoClose)

        KeyBoardShortCut.register(["ArrowUp"], () => this.moveFocus("up"), "autocomplete", true)
        KeyBoardShortCut.register(["ArrowDown"], () => this.moveFocus("down"), "autocomplete", true)
        KeyBoardShortCut.register(["Enter"], () => {this.selectSuggestion(this.focusedId)}, "autocomplete", true)
        this.appState.value.addCurrentActionCancellation(() => {this.hideSuggestions()}, "autocomplete")
    }

    lastPositionUpdate = Date.now()
    boundUpdateSuggestionPosition = this.updateSuggestionPosition.bind(this)
    scrollEnd
    updateSuggestionPosition(ending = false){
        if(!ending)
        this.scrollEnd = setTimeout(()=>{
            if(this.lastPositionUpdate + 20 > Date.now()) return
            this.boundUpdateSuggestionPosition(true)
        }, 20)

        if(Date.now() - this.lastPositionUpdate < 5) return

        let input = this.shadowRoot.querySelector("input")
        let inputBounds = input.getBoundingClientRect()

        if(inputBounds.top > window.innerHeight/2){//more space above then below
            AutocompleteComponent.suggestionElement.style.top = ""
            AutocompleteComponent.suggestionElement.style.bottom = window.innerHeight - inputBounds.top + "px"
            AutocompleteComponent.suggestionElement.style.maxHeight = inputBounds.top - 10 + "px"
        }
        else {
            AutocompleteComponent.suggestionElement.style.top = inputBounds.top + inputBounds.height + "px"
            AutocompleteComponent.suggestionElement.style.bottom = ""
            AutocompleteComponent.suggestionElement.style.maxHeight = window.innerHeight - inputBounds.top - inputBounds.height - 10 + "px"
        }
    }

    hideSuggestions(){
        this.suggestionsVisible = false

        AutocompleteComponent.suggestionElement.classList.remove("visible")

        let input = this.shadowRoot.querySelector("input")
        console.log("hding", this.selected)
        if(this.selected.id > -1) {
            input.value = this.contentProvider(this.selected.data)
        }
        else
            input.value = ""

        //input.blur()

        document.removeEventListener("click", this.boundHandelAutoClose)

        document.removeEventListener("mousewheel", this.boundUpdateSuggestionPosition);
        document.removeEventListener("touchmove", this.boundUpdateSuggestionPosition);

        KeyBoardShortCut.remove("autocomplete")
        this.appState.value.removeCurrentActionCancellation("autocomplete")
    }

    selectSuggestion(option: AutocompleteOption<T> | number){
        if(typeof option == "number") option = this.options.find(option => option.id == this.focusedId)

        if(!option || option.id < 0) return

        this.selected = option
        //this.shadowRoot.querySelector("input").focus()
        this.hideSuggestions()
        this.onSelect(this.selected.data)

        console.log("selecting", this.selected)
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
                this.focusEntry(this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry") as HTMLElement)
            })
    }

    boundHandelAutoClose = this.handleAutoClose.bind(this)
    handleAutoClose(e: Event){
        //TODO target is the body for some reason so clicking the padding of the suggestion box closes it
        //let target = Util.deepEventFocusedElement(this)
        let target = e.composedPath()[0] as HTMLElement
        if (target.dataset.role == "autocompleteInput" ||
            target == AutocompleteComponent.suggestionElement ||
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
        this.appState.value.appElement.shadowRoot.querySelectorAll("#autocompleteSuggestions .entry.focused")
            .forEach(entry => entry.classList.remove("focused"))
        entry?.classList.add("focused")
        this.focusedId = Number(entry.dataset.id)
    }

    moveFocus(direction: "up" | "down"){
        let focused = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry.focused") as HTMLElement
        focused.classList.remove("focused")

        let next: HTMLElement
        if(direction == "up"){
            next = focused?.previousElementSibling as HTMLElement
            if(next == null) next = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry:last-of-type")
        }
        else if(direction == "down"){
            next = focused?.nextElementSibling as HTMLElement
            if(next == null) next = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry:first-of-type")
        }
        next.classList.add("focused")
        this.focusedId = Number(next.dataset.id)
    }

    //region outside interaction
    setFocus(){
        console.log("setting focus")
        this.shadowRoot.querySelector("input").focus()
        this.generateSuggestions()
    }

    clear(){
        this.selected = {id: -1, data: null}
        this.focusedId = -1
        if(this.shadowRoot.querySelector("input"))
            this.shadowRoot.querySelector("input").value = ""
        AnimationHelper.shake(this)
        console.log("cleared", this.selected)
    }
    //endregion
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent<any>;
    }
}

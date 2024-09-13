 import {LitElement, html, PropertyValues, TemplateResult, render} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/autocomplete.styles.scss'
import Util, {AnimationHelper, Logger} from "../../util/Util"
import {SimpleOption, Regex, SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCaretDown} from "@fortawesome/free-solid-svg-icons"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
 import {KeyBoardShortCut} from "../../util/KeyboardShortcut"


//TODO check why when clicking away it

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
    allowNoSelection: boolean = false

    @property()
    selected: SimpleOption<number, T> = {id: -1, data: null}

    @property()
    options: SimpleOption<number, T>[] = []

    @property()
    showIcon: boolean = true

    /**
     * a custom function that is called whenever the user selects an option
     * this is typically used to update the state of the parent component
     * @param option
     * @param isInitialCall
     */
    @property()
    onSelect = (option: T, isInitialCall?: boolean) => {}

    /**
     * should provide the applicable suggestions based on the search term
     * @param searchTerm string
     */
    @property()
    querySuggestions: (searchTerm: string) => Promise<SimpleOption<number, T>[]> = (searchTerm) => {return Promise.resolve([])}

    /**
     * should provide the icon for the suggestion that will be displayed alongside the content
     * @param data
     */
    @property()
    iconProvider: (data: T) => TemplateResult = (data) => {return html`no icon provider`}

    /**
     * converts an options data into a string that can be displayed to the user
     */
    @property()
    contentProvider: (data: T) => string = () => {return "no content provider"}

    private focusedId: number = -1 //the id of the hovered or arrow-key-selected suggestion

    private static suggestionsVisible: AutocompleteComponent<any> = null

    openedThroughClick = false //allows for selection of text without the whole text automatically being selected

    autoCloseTimeout //automatically closes the suggestion box after one minute in case through some bug it stays open

    @property()
    private appState: ObservedProperty<AppState>

    static suggestionElement: HTMLElement //the absolute positioned element that contains the suggestions

    private logger = new Logger(false, "autocomplete")

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)

        if(!AutocompleteComponent.suggestionElement) AutocompleteComponent.suggestionElement = model.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions") as HTMLElement
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        //probably for default values
        this.selectSuggestion(this.selected)
    }

    render() {

        //render the suggestions into the separate suggestion element
        render(
            html`${
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
            }`, AutocompleteComponent.suggestionElement
        )

        return html`
            <style>${styles}</style>
            <input
                type="text" placeholder="${this.placeholder}"
                data-role="autocompleteInput" part="input"
                .disabled="${this.disabled}"
                value="${this.selected.id > -1 ? this.contentProvider(this.selected.data) : ""}"
                @mouseup="${ this.generateSuggestions }"
                @keyup="${ (e)=> this.generateSuggestions(e) }"
                @keydown="${this.handleTabOut}"
                @mousedown="${() => this.openedThroughClick = true}"
                @focus="${(e) => {
                if (!this.openedThroughClick) this.generateSuggestions(e)
                }}"
            >
            <!-- display the dropdown icon if the width is enough -->
            ${(this.clientWidth > 50 || this.selected.id < 0) && this.showIcon == true ? unsafeSVG(icon(faCaretDown, {attributes: {part: "icon"}}).html[0]) : html``}
        `
    }

    /**
     * displays the suggestion container
     */
    showSuggestions(){
        console.log("showing autocomplete suggestions")
        this.logger.log("----SHOWING SUGGESTIONS----", this.placeholder, this.selected)
        AutocompleteComponent.suggestionsVisible = this

        this.openedThroughClick = false

        clearTimeout(this.autoCloseTimeout)
        this.autoCloseTimeout = setTimeout(() => this.hideSuggestions(), 60000)

        //prevents double binds when moving directly from one input to another
        KeyBoardShortCut.remove("autocomplete")
        this.appState.value.removeCurrentActionCancellation("autocomplete")

        if( //if the call is not caused by the user selecting text
            window.getSelection().toString() == ""
        ) {
            this.shadowRoot.querySelector("input").select();
        }

        this.updateSuggestionPosition()

        //TODO these are not working properly and seem to impact performance significantly
        //these should update the position of the suggestion box dynamically
        /*document.addEventListener("mousewheel", this.boundUpdateSuggestionPosition);
        document.addEventListener("touchmove", this.boundUpdateSuggestionPosition);*/

        /*AutocompleteComponent.suggestionElement.classList.add("visible") //show the suggestion box*/
        AnimationHelper.show(AutocompleteComponent.suggestionElement, "flex")

        document.addEventListener("click", this.boundHandleAutoClose) //close when clicking outside the suggestion box

        KeyBoardShortCut.register(["ArrowUp"], () => this.moveFocus("up"), "autocomplete", true)
        KeyBoardShortCut.register(["ArrowDown"], () => this.moveFocus("down"), "autocomplete", true)
        KeyBoardShortCut.register(["Enter"], () => {this.selectSuggestion(this.focusedId)}, "autocomplete", true)
        this.appState.value.addCurrentActionCancellation(() => {this.hideSuggestions()}, "autocomplete")
    }

    lastPositionUpdate = Date.now()
    boundUpdateSuggestionPosition = this.updateSuggestionPosition.bind(this)
    updateSuggestionPosition(ending = false){
        /*if(!ending)
        setTimeout(()=>{
            if(this.lastPositionUpdate + 20 > Date.now()) return
            this.boundUpdateSuggestionPosition(true)
        }, 20)

        if(Date.now() - this.lastPositionUpdate < 5) return*/

        let input = this.shadowRoot.querySelector("input")
        let inputBounds = input.getBoundingClientRect()

        AutocompleteComponent.suggestionElement.style.left = inputBounds.left + "px"

        //move the element vertically and adjust the height to fit on screen
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

    /**
     * hides the suggestion container and cleans up the event listeners and selections
     * @param afterSelection
     * @param isInitialCall
     */
    hideSuggestions( afterSelection = false){
        this.logger.log("hiding", this.placeholder)
        this.logger.log(this.selected)

        let input = this.shadowRoot.querySelector("input")

        AutocompleteComponent.suggestionsVisible = null
        /*AutocompleteComponent.suggestionElement.classList.remove("visible")*/
        AnimationHelper.hide(AutocompleteComponent.suggestionElement)

        //if the component allows the selection to be empty
        //and the hiding did not happen after a selection was clicked/entered
        //  (if the user selected an option without typing anything in to the input field the field will be empty
        //  but youd want something to be selected, if something was selected and then the user clears out the
        //  input field you want nothing to be selected)
        //and the input is empty
        if(this.allowNoSelection && afterSelection == false && Regex.empty.test(input.value)) {
            this.selected = {id: -1, data: null}
            this.onSelect(this.selected.data)
        }

        //if a valid value was selected update the text in the input
        if(this.selected.id > -1) {
            input.value = this.contentProvider(this.selected.data)
            this.logger.log("setting content", this.selected)
        }
        else{
            input.value = ""
        }

        document.removeEventListener("click", this.boundHandleAutoClose)

        //unused, would be for dynamic positioning
        document.removeEventListener("mousewheel", this.boundUpdateSuggestionPosition);
        document.removeEventListener("touchmove", this.boundUpdateSuggestionPosition);

        KeyBoardShortCut.remove("autocomplete")
        this.appState.value.removeCurrentActionCancellation("autocomplete")
    }

    /**
     * select a specific option (by clicking or using keyboard)
     * @param option either a AutocompleteOption or the id of the option
     * @param isInitialCall
     */
    selectSuggestion(option: SimpleOption<number, T> | number, isInitialCall?: boolean){
        this.logger.log("selecting", this.placeholder, option)

        if(typeof option == "number") option = this.options.find(item => item.id == option)

        if(!option || option.id < 0) {
            this.logger.log("selected option is invalid:", option)
            this.logger.log("available options", this.options)
            return
        }
        this.selected = option
        this.hideSuggestions(true)
        this.onSelect(this.selected.data, isInitialCall) //custom function that's different for each component

        this.classList.remove("error")

        this.logger.log("selected", this.placeholder, this.selected)
    }

    /**
     * query the suggestions based on the input
     * @param e
     * @param searchTermOverride
     */
    generateSuggestions(e?: KeyboardEvent, searchTermOverride?: string){
        return new Promise((resolve, reject) => {
            //TODO we might want to limit rates on this function, if we do that we have to delay the query by a few ms
            // and check if a new query showed up when the delay is over we cant just exit out of the function if the last
            // call was less than XXms ago cause then the search query of the new call would be ignored

            //TODO display selected suggestion on first focus

            //ignore keys that serve another purpose
            let input = this.shadowRoot.querySelector("input") as HTMLInputElement
            if (e) { //TODO sub optimal solution it would be better to use a whitelist instead of a blacklist
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Alt", "Control", "Escape"].includes(e.key)) return
            }

            this.logger.log("generating suggestions", this.placeholder, this.selected)

            //results in flashing while waiting for the server to respond
            /*render(html`<div class="loading">Lade...</div>`, AutocompleteComponent.suggestionElement)*/

            if (AutocompleteComponent.suggestionsVisible != this) this.showSuggestions()

            //timeout so that the getSelection() is updated (without this the mouseup would be called and the selection
            // would still be the old one
            setTimeout(() => {
                let searchTerm = input.value
                if ( //if the user selects part of the input that should be used as the search term
                    window.getSelection().toString() != "" &&
                    input.value.includes(window.getSelection().toString())
                ) {
                    searchTerm = window.getSelection().toString()
                }

                if(searchTermOverride != undefined) searchTerm = searchTermOverride

                this.querySuggestions(searchTerm)
                    .then(options => {
                        this.options = options
                        resolve(this.options)
                    })
                    .then(() => {
                        //focus the first option
                        this.focusEntry(this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry") as HTMLElement)
                    })
            },)

            this.updateSuggestionPosition()
        })
    }

    boundHandleAutoClose = this.handleAutoClose.bind(this)
    /**
     * closes the suggestion box if focus is lost
     * @param e
     */
    handleAutoClose(e: Event){
        let target = e.composedPath()[0] as HTMLElement
        this.logger.log("handling auto close", this.placeholder, target)
        if (target.dataset.role == "autocompleteInput" ||
            target == AutocompleteComponent.suggestionElement ||
            target.classList.contains("entry"))
        {
            return
        }
        this.hideSuggestions()
    }

    handleTabOut(e: KeyboardEvent){
        this.logger.log(e.key)
        if(e.key == "Tab") this.hideSuggestions()
    }

    /**
     * focuses a specific entry or none
     * @param entry element or nothing
     */
    focusEntry(entry?: HTMLElement){
        if(!entry) {
            this.focusedId = -1
            return
        }
        this.appState.value.appElement.shadowRoot.querySelectorAll("#autocompleteSuggestions .entry.focused")
            .forEach(entry => entry.classList.remove("focused"))
        entry.classList.add("focused")
        this.focusedId = Number(entry.dataset.id)
    }

    /**
     * Moves the focused element using the arrow keys
     * @param direction "up" or "down"
     */
    moveFocus(direction: "up" | "down"){
        let focused = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry.focused") as HTMLElement
        focused.classList.remove("focused")

        let next: HTMLElement
        if(direction == "up"){
            next = focused?.previousElementSibling as HTMLElement
            if(next == null) {
                //the first element is currently focused -> jump to the last
                next = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry:last-of-type")
            }
        }
        else if(direction == "down"){
            next = focused?.nextElementSibling as HTMLElement
            if(next == null) {
                //the last element is currently focused -> jump to the first
                next = this.appState.value.appElement.shadowRoot.querySelector("#autocompleteSuggestions .entry:first-of-type")
            }
        }

        this.logger.log("moving focus", this.placeholder, focused, next)

        next.classList.add("focused")
        this.focusedId = Number(next.dataset.id)
    }

    //region outside interaction
    setFocus(){
        this.logger.log("setting focus", this.placeholder)
        this.shadowRoot.querySelector("input").focus()
        this.generateSuggestions(undefined, "")
    }

    clear(animated = true){
        if(this.selected.id > -1 && animated) AnimationHelper.shake(this)
        this.logger.log("clearing", this.placeholder)
        this.selected = {id: -1, data: null}
        this.focusedId = -1
        if(this.shadowRoot.querySelector("input"))
            this.shadowRoot.querySelector("input").value = ""
    }
    //endregion
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-autocomplete": AutocompleteComponent<any>;
    }
}

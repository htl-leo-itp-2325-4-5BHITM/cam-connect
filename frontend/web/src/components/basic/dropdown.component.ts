import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/dropdown.styles.scss'
import {SimpleOption} from "../../base"
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import Util, {AnimationHelper} from "../../util/Util"

@customElement('cc-dropdown')
export class DropdownComponent extends LitElement {
    @property()
    options: SimpleOption<(string | number), string>[] = []

    @property()
    selected: SimpleOption<string | number, string>

    @property({reflect: true})
    isOpen: boolean = false

    @property()
    onSelect: (option: SimpleOption<string | number, string>) => void = () => {}

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if(this.selected?.id == undefined && this.options && this.options.length > 0){
            console.log("setting selected")
            this.selected = this.options[0]

            this.onSelect(this.selected)
        }
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="dropdown" @mouseup="${this.toggleOpenClose}">
                <p>${this.selected?.data}</p>
                ${unsafeSVG(icon(faCaretDown).html[0])}
            </div>
            <div class="dropdownOptions">
                ${this.options?.map(option => {
                  return html`<p class="option" @click="${() => this.selectOption(option)}">${option.data}</p>`  
                })}
            </div>
        `
    }

    toggleOpenClose(){
        this.isOpen = !this.isOpen

        if(this.isOpen){
            document.addEventListener('mousedown', this.boundHandleAutoclose)
            AnimationHelper.show(this.shadowRoot.querySelector('.dropdownOptions'), "flex")
        }
        else{
            document.removeEventListener('mousedown', this.boundHandleAutoclose)
            AnimationHelper.hide(this.shadowRoot.querySelector('.dropdownOptions'))
        }
    }

    boundHandleAutoclose = this.handleAutoclose.bind(this)
    handleAutoclose(e: Event){
        if(!this.shadowRoot.contains(e.composedPath()[0] as HTMLElement)){
            this.toggleOpenClose()
        }
    }

    selectOption(option: SimpleOption<string | number, string>) {
        this.selected = option
        this.onSelect(option)
        this.toggleOpenClose()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-dropdown": DropdownComponent
    }
}

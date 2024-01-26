import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {ColorEnum} from "../../base"
import {ButtonComponent} from "./button.component";

export enum ChipSize {SMALL="small", BIG="big"}

@customElement('cc-chip')
export class ChipComponent extends LitElement {
    @property({type: ColorEnum})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: ChipSize})
    size?: ChipSize = ChipSize.BIG

    @property({type: Boolean})
    removeable?: Boolean = false

    @property({type: String})
    text?: String = "Chip"

    @property({type: Boolean, converter: (value) => value === '' || value === 'true'})
    expandable?: Boolean = false

    @property({type: HTMLElement})
    base?: HTMLElement

    @property({type: HTMLElement})
    detail?: HTMLElement

    render() {
        this.base = this.querySelector("div") ? this.querySelector("div") : this
        this.detail = this.querySelector(".detail")

        return html`
            <style>${styles}</style>
             <div class="cc-chip" color="${this.color}" size="${this.size}" expandable="${this.expandable}" @click="${this.handleClick}">
                ${this.querySelector("div") ? this.querySelector("div") : this.innerHTML}
                ${this.removeable ? this.renderRemoveButton() : ""}
            </div>
        `
    }

    handleClick() {
        if(this.expandable) this.toggleDetails()
        if(this.removeable === false) return
        this.remove()
    }

    renderRemoveButton(){
        return html`
            <div class="remove">
                ${unsafeSVG(icon(faXmark).html[0])}
            </div>
        `
    }

    isOpen?: boolean = false
    toggleDetails() {
        this.isOpen = !this.isOpen
        console.log(this.isOpen)

        if(this.isOpen){
            this.shadowRoot.querySelector(".cc-chip").innerHTML = this.detail.innerHTML
        } else{
            this.shadowRoot.querySelector(".cc-chip").innerHTML = `
                ${this.base.innerHTML}
                ${this.removeable ? this.renderRemoveButton() : ""}
            `
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-chip": ChipComponent
    }
}

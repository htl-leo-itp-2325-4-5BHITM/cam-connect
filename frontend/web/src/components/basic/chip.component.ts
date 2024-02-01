import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {ColorEnum, SizeEnum} from "../../base"
import {ButtonComponent} from "./button.component";

export enum ChipType { EXPANDABLE="expandable", REMOVABLE="removable", CLICKABLE="clickable", DEFAULT="default" }

@customElement('cc-chip')
export class ChipComponent extends LitElement {
    @property({type: ColorEnum})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: String})
    text?: String = this.innerText || "Chip";

    @property()
    type: ChipType = ChipType.DEFAULT

    @property({type: HTMLElement})
    base?: HTMLElement

    @property({type: HTMLElement})
    detail?: HTMLElement

    isExpanded: boolean = false

    constructor() {
        super()
        if(this.hasAttribute('@click') && this.type == ChipType.DEFAULT){
            this.type = ChipType.CLICKABLE
        }
    }

    render() {
        if(this.isExpanded){
            return html`
                <style>${styles}</style>
                 <div class="cc-chip" color="${this.color}" size="${this.size}" type="${this.type}" @click="${this.handleClick}">
                     expanded
                    <slot></slot>
                </div>
            `
        } else{
            return html`
                <style>${styles}</style>
                 <div class="cc-chip" color="${this.color}" size="${this.size}" type="${this.type}" @click="${this.handleClick}">
                    ${this.text}
                    ${this.type == ChipType.REMOVABLE ? this.renderRemoveButton() : ""}
                </div>
            `
        }
    }

    handleClick() {
        if(this.type == ChipType.EXPANDABLE) {
            this.isExpanded = !this.isExpanded
            this.style.minHeight = this.clientHeight + "px"
            this.style.minWidth = this.clientWidth + "px"
            this.requestUpdate()
            setTimeout(() => {

            },)
            this.style.minHeight = "auto"
            this.style.minWidth = "auto"
        }
        else if(this.type == ChipType.REMOVABLE) this.remove()
    }

    renderRemoveButton(){
        return html`
            <div class="remove">
                ${unsafeSVG(icon(faXmark).html[0])}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-chip": ChipComponent
    }
}

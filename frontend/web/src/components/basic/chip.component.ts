import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {ColorEnum, SizeEnum} from "../../base"

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
    nonExpandedBounds

    constructor() {
        super()
        //automatically set type to clickable if element has @click assigned on call
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

            if(this.isExpanded){
                this.animate([
                    {maxHeight: "100px", maxWidth: "100px"},
                    {maxHeight: this.nonExpandedBounds.height + "px", maxWidth: this.nonExpandedBounds.width + "px"}
                ], {iterations: 1, duration: 500, fill: "forwards"})

                setTimeout(() => {
                    this.requestUpdate()
                },500)
            }
            else{
                this.requestUpdate()
                this.nonExpandedBounds = this.getBoundingClientRect()
                this.animate([
                    {maxHeight: this.nonExpandedBounds.height + "px", maxWidth: this.nonExpandedBounds.width + "px"},
                    {maxHeight: "1000px", maxWidth: "1000px"}
                ], {iterations: 1, duration: 5000, fill: "forwards"})
            }

            this.isExpanded = !this.isExpanded
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

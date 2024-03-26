import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {ColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {AnimationHelper} from "../../util"

export enum ChipType { EXPANDABLE="expandable", REMOVABLE="removable", CLICKABLE="clickable", DEFAULT="default" }

@customElement('cc-chip')
export class ChipComponent extends LitElement {
    @property({type: ColorEnum, reflect: true})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: String})
    text?: String = this.innerText || "Chip";

    @property()
    type: ChipType = ChipType.DEFAULT

    @property({reflect: true})
    private isExpanded: boolean = false

    @queryAssignedElements()
    private detailElement!: Array<HTMLElement>;

    constructor() {
        super()
        //automatically set type to clickable if element has @click assigned on call
        if(this.hasAttribute('@click') && this.type == ChipType.DEFAULT){
            this.type = ChipType.CLICKABLE
        }
    }

    render() {
        return html`
            <style>${styles}</style>
             <div class="cc-chip" color="${this.color}" size="${this.size}" type="${this.type}" @click="${this.handleClick}">
                 ${this.text}
                 ${this.type == ChipType.REMOVABLE && this.isExpanded ? this.renderRemoveButton() : ""}
            </div>
            <slot></slot>
        `
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        setTimeout(() => {
            this.detailElement[0]?.querySelectorAll('[closeChip]').forEach((element) => {
                element.addEventListener("click", () => {
                    this.toggleExpand()
                })
            })
        },)
    }

    private handleClick() {
        if(this.type == ChipType.REMOVABLE) {
            this.remove()
        }
        else if(this.type == ChipType.EXPANDABLE){
            this.toggleExpand()
        }
    }

    private renderRemoveButton(){
        return html`
            <div class="remove">
                ${unsafeSVG(icon(faXmark).html[0])}
            </div>
        `
    }

    toggleExpand(){

        if(this.isExpanded){
            AnimationHelper.hide(this.detailElement[0])
            this.isExpanded = false
            window.removeEventListener("click", this.handleAutoClose)
            model.appState.value.removeCurrentActionCancellation("chip")
        }
        else{
            AnimationHelper.show(this.detailElement[0])
            this.isExpanded = true
            window.addEventListener("click", this.handleAutoClose)
            model.appState.value.addCurrentActionCancellation(this.toggleExpand.bind(this), "chip")
        }
    }

    handleAutoClose = (event: MouseEvent) => {
        if(!this.shadowRoot.contains(event.composedPath()[0] as HTMLElement)){
            window.removeEventListener("click", this.handleAutoClose)
            this.toggleExpand()
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-chip": ChipComponent
    }
}

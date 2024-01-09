import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

enum Color {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
enum Size {SMALL="small", BIG="big"}

@customElement('cc-chip')
export class ChipComponent extends LitElement {
    @property({type: Color})
    color?: Color = Color.ACCENT

    @property({type: Size})
    size?: Size = Size.BIG

    @property({type: Boolean})
    removeable?: Boolean = false

    @property({type: String})
    text?: String = "Chip"

    removeChip(){
        if(this.removeable === false) return
        this.remove()
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-chip" color="${this.color}" size="${this.size}"
                @click="${this.removeChip}">
                ${this.innerHTML}
                ${this.removeable ? this.renderRemoveButton() : ""}
            </div>`
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

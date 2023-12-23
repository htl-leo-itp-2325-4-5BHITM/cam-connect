import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Fontawesome from 'lit-fontawesome'

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

    //test = icon(faXmark).html[0]
    //testo = html`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><title>Replay</title><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"/></g></svg>`

    /*static get styles() {
        return [ Fontawesome ]
    }*/

    removeChip(){
        if(this.removeable === false) return
        this.remove()
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-chip ${this.removeable ? 'removeDiv' : ''}" color="${this.color}" size="${this.size}"
                @click="${this.removeChip}">
                ${this.text}
                ${this.removeable ? html`<span>&nbsp;x</span>` : ""}
            </div>`
        //todo fontawesome icon einfügen
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-chip": ChipComponent
    }
}

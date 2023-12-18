import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons";

enum Color {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
enum Size {SMALL="small", BIG="big"}


@customElement('cc-chip')
export class ChipComponent extends LitElement {
    @property({type: Color})
    color?: Color = Color.ACCENT;

    @property({type: Size})
    size?: Size = Size.BIG;

    @property({type: Boolean})
    removeable?: Boolean = false;

    @property({type: String})
    value?: String = "Chip";

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-chip ${this.removeable ? 'removeDiv' : ''}" color="${this.color}" size="${this.size}"
                @click="${(e:Event) => {(e.target as HTMLElement).remove()}}">
                ${this.value}
                ${(this.removeable ? html`${icon(faXmark)}` : '')}
            </div>`
        //todo fontawesome icon einfügen
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-chip": ChipComponent;
    }
}

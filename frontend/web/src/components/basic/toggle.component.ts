import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/chip.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';

enum Color {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
enum Size {SMALL="small", BIG="big"}

@customElement('cc-toggle')
export class ToggleComponent extends LitElement {
    @property({type: Color})

    render() {
        return html`
            <style>${styles}</style>
            <label>${this.innerHTML}</label>
            <div class="toggle">
                <div class="knob"></div>
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-toggle": ToggleComponent
    }
}

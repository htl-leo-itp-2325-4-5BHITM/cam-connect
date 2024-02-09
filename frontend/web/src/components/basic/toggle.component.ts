import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/toggle.styles.scss'
import {ColorEnum} from "../../base"

@customElement('cc-toggle')
export class ToggleComponent extends LitElement {
    @property({type: ColorEnum})
    color: ColorEnum = ColorEnum.ACCENT

    @property()
    toggled: boolean = false

    @property()
    toggleAction: (toggled: boolean) => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <label>${this.innerHTML}</label>
            <div class="toggle ${this.toggled ? 'on' : 'off'}">
                <div class="knob"></div>
            </div>`
    }

    constructor() {
        super()
        this.onclick = this.toggle
    }

    toggle(){
        this.toggled = !this.toggled
        this.toggleAction(this.toggled)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-toggle": ToggleComponent
    }
}

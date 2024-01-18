import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/button.styles.scss'

export enum ButtonSize {BIG="big", SMALL="small", XSMALL="xsmall"}
export enum ButtonType {FILLED="filled", OUTLINED="outlined", TEXT="text", UNDERLINED="underlined"}
export enum ButtonColor {ACCENT="accent", GRAY="gray"}

@customElement('cc-button')
export class ButtonComponent extends LitElement {
    @property({type: ButtonSize})
    size?: ButtonSize = ButtonSize.BIG;

    @property({type: ButtonType})
    type?: ButtonType = ButtonType.FILLED;

    @property({type: ButtonColor})
    color?: ButtonColor = ButtonColor.ACCENT;

    @property({type: String})
    value?: String = this.innerText || "Button";

    @property()
    test: () => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <button class="cc-button" color="${this.color}" type="${this.type}" @click="${this.test}" size="${this.size}">
                ${this.value}
            </button>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-button": ButtonComponent;
    }
}

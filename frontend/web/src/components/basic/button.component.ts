import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/button.styles.scss'

export enum ButtonSize {BIG="big", MEDIUM="medium", SMALL="small"}
export enum ButtonType {FILLED="filled", OUTLINED="outlined", TEXT="text", UNDERLINED="underlined"}
export enum ButtonColor {ACCENT="accent", GRAY="gray"}

/**
 * Buttons accept any element inside them to be assigned a slot="" of left or right. These will be placed before or after the text.
 * Text and SVGs will automatically be formatted.
 * When using a text as a prefix or suffix don't put the button text as innerHTML, that will cause duplicate text,
 * in this case, use the text="" property instead.
 */
@customElement('cc-button')
export class ButtonComponent extends LitElement {
    @property({type: ButtonSize})
    size?: ButtonSize = ButtonSize.MEDIUM;

    @property({type: ButtonType})
    type?: ButtonType = ButtonType.FILLED;

    @property({type: ButtonColor})
    color?: ButtonColor = ButtonColor.ACCENT;

    @property({type: String})
    text?: String = this.innerText || "Button";

    @property()
    test: () => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <button class="cc-button" color="${this.color}" type="${this.type}" @click="${this.test}" size="${this.size}">
                <slot name="left"></slot>
                ${this.text}
                <slot name="right"></slot>
            </button>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-button": ButtonComponent;
    }
}

import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/button.styles.scss'
import {ColorEnum, SimpleColorEnum, SizeEnum} from "../../base"

export enum ButtonType {FILLED="filled", OUTLINED="outlined", TEXT="text", UNDERLINED="underlined"}

/**
 * Buttons accept any element inside them to be assigned a slot="" of left or right. These will be placed before or after the text.
 * Text and SVGs will automatically be formatted.
 * When using a text as a prefix or suffix don't put the button text as innerHTML, that will cause duplicate text,
 * in this case, use the text="" property instead.
 */
@customElement('cc-button')
export class ButtonComponent extends LitElement {
    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: ButtonType})
    type?: ButtonType = ButtonType.FILLED

    @property({type: ColorEnum})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: String})
    text?: string | TemplateStringsArray = this.innerText || "Button"

    @property({type: Boolean})
    disabled?: boolean = false

    @property({type: Boolean})
    noPadding?: boolean = false

    @property({type: Boolean})
    loading?: boolean = false

    @property()
    loadingState: boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <button part="button" color="${this.color}" type="${this.type}" size="${this.size}" .disabled="${this.disabled}" noPadding="${this.noPadding}">
                <slot name="left"></slot>
                ${this.loadingState ? "loading..." : this.text}
                <slot name="right"></slot>
            </button>`
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if(this.loading)
        this.addEventListener("click", () => {
            this.loadingState = true
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-button": ButtonComponent;
    }
}

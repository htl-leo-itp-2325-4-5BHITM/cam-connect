import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/button.styles.scss'

enum Size {MEDIUM="big", SMALL="small", XSMALL="xsmall"}
enum Type {FILLED="filled", OUTLINED="outlined", TEXT="text"}
enum Color {ACCENT="accent", GRAY="gray"}

@customElement('cc-button')
export class ButtonComponent extends LitElement {
    @property({type: Size})
    size?: Size = Size.MEDIUM;

    @property({type: Type})
    type?: Type = Type.FILLED;

    @property({type: Color})
    color?: Color = Color.ACCENT;

    @property({type: String})
    value?: String = "Button";

    render() {
        return html`
            <style>${styles}</style>
            <button class="cc-button" color="${this.color}" type="${this.type}" size="${this.size}">
                ${this.value}
            </button>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-button": ButtonComponent;
    }
}

import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/circle-select.styles.scss'

enum Color {ACCENT="accent", GRAY="gray"}
enum Type {SINGLE="single", MULTIPLE="multiple"}


@customElement('cc-circle-select')
export class CircleSelectComponent extends LitElement {
    @property({type: Color})
    color?: Color = Color.ACCENT;

    @property({type: Type})
    type?: Type = Type.SINGLE;

    @property({type: Boolean})
    checked?: Boolean = false;

    render() {
        return html`
            <style>${styles}</style>
            <div @click="${this.checked = !this.checked}">
                <img src="../../assets/${this.checked ? "checked" : "unchecked"}_${this.type}.svg" alt="">\
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-circle-select": CircleSelectComponent;
    }
}
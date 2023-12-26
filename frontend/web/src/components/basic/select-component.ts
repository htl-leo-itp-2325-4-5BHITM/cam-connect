import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'

@customElement('cc-select')
export class SelectComponent extends LitElement {
    render() {
        const selectElements = Array.from(this.querySelectorAll('cc-select-element'))

        return html`
            <style>${styles}</style>
            <div class="select">
                <slot></slot>
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-select": SelectComponent;
    }
}
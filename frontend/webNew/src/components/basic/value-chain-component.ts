import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/value-chain.styles.scss'

@customElement('cc-value-chain')
export class ValueChainComponent extends LitElement {
    render() {
        const selectElements = Array.from(this.querySelectorAll('*'))

        return html`
            <style>${styles}</style>
            <div class="chain">
                ${selectElements.map((value) => html`${value}`)}
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-value-chain": ValueChainComponent;
    }
}
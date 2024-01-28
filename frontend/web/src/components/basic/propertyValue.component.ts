import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/property-value.styles.scss'

export enum PropertyValueSize {BIG, SMALL}

@customElement('cc-property-value')
export class PropertyValueComponent extends LitElement {
    @property({type: String})
    property?: String = 'Property';

    @property({type: String})
    value?: String = 'Value';

    @property({type: PropertyValueSize})
    size?: PropertyValueSize = PropertyValueSize.SMALL

    @property({type: Boolean})
    isLink?: Boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <div size="${this.size}" isLink="${this.isLink}">
                <p class="property">${this.property}:</p>
                <p class="value">${this.value}</p>
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-property-value": PropertyValueComponent;
    }
}
import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/propertyValue.styles.scss'
import {SizeEnum} from "../../base"


@customElement('cc-property-value')
export class PropertyValueComponent extends LitElement {
    @property({type: String})
    property?: String = 'Property';

    @property({type: String})
    value?: String = 'Value';

    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: Boolean})
    isLink?: Boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <p size="${this.size}" isLink="${this.isLink}">
                <span class="property">${this.property}:</span>
                <span class="value">${this.value}</span>
            </p>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-property-value": PropertyValueComponent;
    }
}
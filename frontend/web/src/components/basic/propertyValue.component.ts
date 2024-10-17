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

    @property()
    clickAction: () => void

    @property({type: Boolean, reflect: true})
    noWrap: boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <p size="${this.size}" isLink="${this.clickAction != undefined}">
                <span class="property">${this.property}:</span>
                <span class="value" @click="${this.clickAction}">${this.value}</span>
            </p>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-property-value": PropertyValueComponent;
    }
}
import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/property-value.styles.scss'

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt"}

@customElement('cc-property-value')
export class PropertyValueComponent extends LitElement {
    @property({type: String})
    property?: String = 'Property';

    @property({type: String})
    value?: String = 'Value';

    render() {
        return html`
            <style>${styles}</style>
            <div>
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
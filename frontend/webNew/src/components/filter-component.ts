import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/filter.styles.scss'

@customElement('cc-filter')
export class FilterComponent extends LitElement {
    // Declare reactive properties
    @property({type:String})
    accountname?: string = 'No username provided'

    // Render the UI as a function of component state
    render() {
        return html`
            <cc-filter-block name="Filtername">
                <p>test</p>
            </cc-filter-block>
        `;
    }
}
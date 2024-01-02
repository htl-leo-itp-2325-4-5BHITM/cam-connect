import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/filter.styles.scss'
import {ButtonColor, ButtonSize, ButtonType} from '../basic/button-component'

@customElement('cc-filter')
export class FilterSidebarComponent extends LitElement {
    @property({type:String})
    accountname?: string = 'No username provided'


    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-filter">
                <div class="buttons">
                    <cc-button size="${ButtonSize.BIG}" color="${ButtonColor.ACCENT}" type="${ButtonType.FILLED}">Neuer Verleih</cc-button>
                    <cc-button size="${ButtonSize.BIG}" color="${ButtonColor.ACCENT}" type="${ButtonType.OUTLINED}">Multi Verleih</cc-button>
                </div>
                <cc-line></cc-line>
                <div class="sorts">
                    <cc-select>
                        <cc-select-element>raster</cc-select-element>
                        <cc-select-element>liste</cc-select-element>
                    </cc-select>
                </div>
                <cc-line></cc-line>
                <slot name="primaryFilters"></slot>
                <cc-line></cc-line>
                <slot></slot>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-sidebar": FilterSidebarComponent
    }
}
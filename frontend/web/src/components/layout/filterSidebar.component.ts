import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/filterSidebar.styles.scss'
import {ButtonColor, ButtonSize, ButtonType} from '../basic/button.component'

@customElement('cc-filter')
export class FilterSidebarComponent extends LitElement {
    @property({type:String})
    accountname?: string = 'No username provided'

    constructor(username: string) {
        super()
        this.accountname = username
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="buttons">
                <cc-button size="${ButtonSize.BIG}" color="${ButtonColor.ACCENT}" type="${ButtonType.FILLED}">Neuer
                    Verleih
                </cc-button>
                <cc-button size="${ButtonSize.BIG}" color="${ButtonColor.ACCENT}" type="${ButtonType.OUTLINED}">
                    Multi Verleih
                </cc-button>
            </div>
            <cc-line></cc-line>
            <div class="sorts">
                <cc-select>
                    <p class="selected">raster</p>
                    <p>liste</p>
                </cc-select>
                <cc-toggle>Nur verfügbare anzeigen</cc-toggle>
            </div>
            <cc-line></cc-line>
            <slot name="primaryFilters"></slot>
            <cc-line></cc-line>
            <div class="secondaryFilters">
                <slot></slot>
            </div>

            <div class="user">
                <img src="../../../assets/user-icon-default.svg" alt="user">
                <p>${(this.accountname)}</p>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter-sidebar": FilterSidebarComponent
    }
}
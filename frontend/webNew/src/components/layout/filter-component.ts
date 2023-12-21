import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/filter.styles.scss'
import {DeviceType} from "../../service/devicetype-service"
import {deviceTypeToFilterOption} from "../../util"

@customElement('cc-filter')
export class FilterComponent extends LitElement {
    @property({type:String})
    accountname?: string = 'No username provided'


    render() {
        return html`
            <style>${styles}</style>
            <div>
                <p>filter sidebar</p>
                <slot></slot>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-filter": FilterComponent
    }
}
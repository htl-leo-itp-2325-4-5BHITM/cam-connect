import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/dropdown.styles.scss'
import {SimpleOption} from "../../base"

@customElement('cc-dropdown')
export class DropdownComponent extends LitElement {
    @property()
    options: SimpleOption<(string | number), string>[] = []

    render() {
        return html`
            <style>${styles}</style>
            <select>
                ${this.options.map(option => {
                  return html`<option value="${option.id}">${option.data}</option>`  
                })}
            </select>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-dropdown": DropdownComponent
    }
}

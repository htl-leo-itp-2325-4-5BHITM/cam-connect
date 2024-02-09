import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/line.styles.scss'

export enum LineColor {LIGHT="800", LIGHTER="600", DEFAULT="500"}
export enum LineType {HORIZONTAL="horizontal", VERTICAL="vertical"}

@customElement('cc-line')
export class LineComponent extends LitElement {
    @property({type: LineColor})
    color?: LineColor = LineColor.DEFAULT

    @property({type: LineType})
    type?: LineType = LineType.HORIZONTAL

    render() {
        return html`
            <style>${styles}</style>
            <span class="cc-line" color="${this.color}" type="${this.type}"</span>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-line": LineComponent
    }
}

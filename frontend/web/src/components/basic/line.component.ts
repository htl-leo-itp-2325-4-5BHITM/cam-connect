import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/line.styles.scss'

export enum LineColor {LIGHT="800", LIGHTER="600", DEFAULT="500"}
export enum LineType {HORIZONTAL="horizontal", VERTICAL="vertical"}

@customElement('cc-line')
export class LineComponent extends LitElement {
    @property({type: LineColor, reflect: true})
    color?: LineColor = LineColor.DEFAULT

    @property({type: LineType, reflect: true})
    type?: LineType = LineType.HORIZONTAL

    render() {
        return html`
            <style>${styles}</style>
        `
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if(this.type == LineType.VERTICAL){
            //This might cause errors with paddings where it gets to big.. sry in advance
            this.style.height = this.parentElement.clientHeight + "px"
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-line": LineComponent
    }
}

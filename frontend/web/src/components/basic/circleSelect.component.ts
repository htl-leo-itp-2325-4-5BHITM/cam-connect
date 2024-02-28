import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/circleSelect.styles.scss'

export enum CircleSelectColor {ACCENT="accent", GRAY="gray"}
export enum CircleSelectType {SINGLE="single", MULTIPLE="multiple"}


@customElement('cc-circle-select')
export class CircleSelectComponent extends LitElement {
    @property({type: CircleSelectColor})
    color?: CircleSelectColor = CircleSelectColor.ACCENT;

    @property({type: CircleSelectType})
    type?: CircleSelectType = CircleSelectType.SINGLE;

    @property({ type: Boolean, reflect: true })
    checked?: boolean = false;

    @property()
    onToggle: (checked: boolean) => void = (checked) => {}

    connectedCallback() {
        super.connectedCallback();
    }

    //TODO steal click effect logic from iconCTA (and possibly move that to a custom class in base) to steal the subtle upscale effect
    render() {
        return html`
            <style>${styles}</style>
            <icon-cta .clickAction="${()=>{this.toggleSelect(); this.onToggle(this.checked)}}">
                <div class="${this.type == CircleSelectType.MULTIPLE ? 'multiple' : ''} ${this.color}">
                    <img src="../../assets/${this.checked ? "checked" : "unchecked"}_${this.type}.svg" alt="">\
                </div>
            </icon-cta>`
    }

    toggleSelect() {
        this.checked = !this.checked;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-circle-select": CircleSelectComponent;
    }
}
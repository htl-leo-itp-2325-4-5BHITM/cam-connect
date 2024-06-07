import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/circleSelect.styles.scss'

import singleChecked from '../../../assets/icon/checked_single.svg'
import singleUnchecked from '../../../assets/icon/unchecked_single.svg'
import multipleChecked from '../../../assets/icon/checked_multiple.svg'
import multipleUnchecked from '../../../assets/icon/unchecked_multiple.svg'

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

    @property({ type: Boolean, reflect: true })
    disabled?: boolean = false

    @property()
    onToggle: (checked: boolean) => void = (checked) => {}

    icon

    constructor() {
        super()

        this.icon = {
            single: {
                checked: singleChecked,
                unchecked: singleUnchecked
            },
            multiple: {
                checked: multipleChecked,
                unchecked: multipleUnchecked
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`
            <style>${styles}</style>
            <icon-cta .clickAction="${()=>{this.toggleSelect();this.onToggle(this.checked)}}">
                <div class="${this.type == CircleSelectType.MULTIPLE ? 'multiple' : ''} ${this.color} ${this.disabled == true ? 'disabled' : ''}">
                    <img src="${this.icon[this.type][this.checked ? "checked" : "unchecked"]}" alt="${this.checked ? "x" : "o"}">
                </div>
            </icon-cta>`
    }

    toggleSelect() {
        if(this.disabled == false){
            this.checked = !this.checked;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-circle-select": CircleSelectComponent;
    }
}
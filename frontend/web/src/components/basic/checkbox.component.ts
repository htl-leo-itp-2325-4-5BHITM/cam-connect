import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/checkbox.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import {faSquareCheck} from "@fortawesome/free-solid-svg-icons"
import {faSquare} from "@fortawesome/free-regular-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export enum ChipType { EXPANDABLE="expandable", REMOVABLE="removable", CLICKABLE="clickable", DEFAULT="default" }

@customElement('cc-checkbox')
export class CheckboxComponent extends LitElement {
    @property({reflect: true})
    state: boolean = false

    @property({type: String})
    text?: String = this.innerText || "";

    @property()
    tooltip: string = ""

    @queryAssignedElements()
    private detailElement!: Array<HTMLElement>;

    constructor() {
        super()

        this.addEventListener("click", () => {
            this.state = !this.state
        })
    }

    render() {
        return html`
            <style>${styles}</style>
            ${
            this.state ? unsafeSVG(icon(faSquareCheck).html[0]) : unsafeSVG(icon(faSquare).html[0])
            }
            <p>${this.text}</p>
            <slot></slot>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-checkbox": CheckboxComponent
    }
}

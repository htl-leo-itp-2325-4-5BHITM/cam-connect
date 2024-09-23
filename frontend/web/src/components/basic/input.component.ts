import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/input.styles.scss'
import {ColorEnum, SizeEnum} from "../../base"

export enum InputType { DEFAULT="default", UPLOAD="upload", TEXTAREA="textarea" }

@customElement('cc-input')
export class InputComponent extends LitElement {
    @property({type: ColorEnum, reflect: true})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: String})
    text?: String = this.innerText;

    @property()
    placeholder?: String = ""

    @property()
    type: InputType = InputType.DEFAULT

    @property({reflect: true})
    private isExpanded: boolean = false

    @property()
    tooltip: string = ""

    @property()
    label: string = ""

    @property()
    onInput: (text: String) => void = () => {}

    @queryAssignedElements()
    private detailElement!: Array<HTMLElement>;

    constructor() {
        super()
    }

    render() {
        return html`
            <style>${styles}</style>
            <label for="inputField">${this.label}</label>
            <input id="inputField" type="text" placeholder="${this.placeholder}" value="${this.text}" @input="${(e) => {this.onInput(e.target.value)}}">
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-input": InputComponent
    }
}

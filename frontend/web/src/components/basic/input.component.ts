import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/input.styles.scss'
import {ColorEnum, SizeEnum} from "../../base"

export enum InputType { DEFAULT="default", UPLOAD="upload", TEXTAREA="textarea", NUMBER="number" }

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
    maxLength: number = 255

    @property()
    onInput: (text: String) => void = () => {}

    @queryAssignedElements()
    private detailElement!: Array<HTMLElement>;

    constructor() {
        super()
        if(this.type == InputType.NUMBER){
            this.text = "0"
        }
    }

    render() {
        return html`
            <style>${styles}</style>
            <label for="inputField">${this.label}</label>
            
            ${this.type == InputType.TEXTAREA ? 
                    html`
                        <textarea id="inputField" rows="2" placeholder="${this.placeholder}" maxlength="${this.maxLength}" @input="${(e) => {this.onInput(e.target.value)}}">${this.text}</textarea>` :
                    html`
                        <input id="inputField" type="${this.type == InputType.NUMBER ? 'number' :
                                this.type == InputType.UPLOAD ? 'upload' : 'text'}" placeholder="${this.placeholder}" value="${this.text}"
                               @input="${(e) => {this.onInput(e.target.value)}}" maxlength="${this.maxLength}">
                    `
            }
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-input": InputComponent
    }
}

import {LitElement, html, PropertyValues} from 'lit'
import {customElement, queryAssignedElements, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'
import {Orientation, SimpleColorEnum, SizeEnum} from "../../base"
import URLHandler from "../../urlHandler"

@customElement('cc-select')
export class SelectComponent extends LitElement {
    @queryAssignedElements() options!: Array<HTMLElement>

    @property() size:SizeEnum = SizeEnum.MEDIUM

    @property() spacerColor:SimpleColorEnum = SimpleColorEnum.GRAY

    @property() color:SimpleColorEnum = SimpleColorEnum.GRAY

    @property() onSelect: (option: HTMLElement) => void = () => {}

    @property({type: Boolean}) heavy:boolean = false

    @property() type: Orientation = Orientation.HORIZONTAL

    render() {
        return html`
            <style>${styles}</style>
            <div class="select" size="${this.size}" spacerColor="${this.spacerColor}" color="${this.color}" heavy="${this.heavy}" type="${this.type}">
                <slot></slot>
            </div>`
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.options.forEach(option => {
            option.addEventListener("click", ()=>{this.selectOption(option)})
        })
    }

    selectOption(option:HTMLElement){
        this.options.forEach(option => {option.classList.remove("selected")})
        option.classList.add("selected")
        this.onSelect(option)
    }

    selectOptionByIndex(index:number){
        this.selectOption(this.options[index])
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-select": SelectComponent
    }
}
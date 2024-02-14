import {LitElement, html, PropertyValues} from 'lit'
import {customElement, queryAssignedElements, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'
import {SimpleColorEnum, SizeEnum} from "../../base"

@customElement('cc-select')
export class SelectComponent extends LitElement {
    @queryAssignedElements()
    options!: Array<HTMLElement>
    @property()
    size:SizeEnum = SizeEnum.MEDIUM
    @property()
    spacerColor:SimpleColorEnum = SimpleColorEnum.GRAY
    @property()
    optionSelected: (option: HTMLElement) => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <div class="select" size="${this.size}" spacerColor="${this.spacerColor}">
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
        this.optionSelected(option)
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
import {LitElement, html, PropertyValues} from 'lit'
import {customElement, queryAssignedElements, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'
import {SizeEnum} from "../../base"

@customElement('cc-select')
export class SelectComponent extends LitElement {
    @queryAssignedElements()
    options!: Array<HTMLElement>

    @property()
    size:SizeEnum = SizeEnum.MEDIUM

    @property()
    optionSelected: (option: HTMLElement) => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <div class="select" size="${this.size}">
                <slot></slot>
            </div>`
    }

    updated() {
        this.options.forEach(option => {
            option.addEventListener("click", ()=>{this.selectOption(option)})
        })
    }

    selectOption(option:HTMLElement){
        this.options.forEach(option => {option.classList.remove("selected")})
        option.classList.add("selected")
        this.optionSelected(option)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-select": SelectComponent
    }
}
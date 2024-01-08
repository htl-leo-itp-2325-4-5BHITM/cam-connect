import {LitElement, html, PropertyValues} from 'lit'
import {customElement, queryAssignedElements, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'

@customElement('cc-select')
export class SelectComponent extends LitElement {
    @queryAssignedElements()
    options!: Array<HTMLElement>

    @property()
    optionSelected = (option: HTMLElement) => {};

    render() {
        return html`
            <style>${styles}</style>
            <div class="select">
                <slot></slot>
            </div>`
    }

    updated() {
        this.options.forEach(option => {
            option.addEventListener("click", ()=>{this.selectOption(option)})
            console.log(option)
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
import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/iconCTA.styles.scss'

@customElement('icon-cta')
export class iconCTAComponent extends LitElement {
    @queryAssignedElements()
    slottedChildren!: Array<HTMLElement>;

    render() {
        return html`
            <style>${styles}</style>
            <slot @slotchange=${this.handleSlotchange}></slot>
           `
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.playClickAnimation)
    }

    handleSlotchange() {
        super.connectedCallback();

        let childHeight = this.slottedChildren[0].clientHeight

        this.style.height = childHeight + "px"
        this.style.width = childHeight + "px"
    }

    playClickAnimation(){
        this.slottedChildren[0].animate([
            {scale: 1},
            {scale: 1.1},
            {scale: 1},
        ],
            {
                iterations: 1,
                duration: 200
            })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "icon-cta": iconCTAComponent;
    }
}

import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/iconCTA.styles.scss'
import {AnimationHelper} from "../../util/Util"

@customElement('icon-cta')
export class iconCTAComponent extends LitElement {
    @queryAssignedElements()
    slottedChildren!: Array<HTMLElement>;

    @property()
    clickAction: () => void = () => {}

    render() {
        return html`
            <style>${styles}</style>
            <slot @slotchange=${this.handleSlotchange}></slot>
           `
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", (e) => {this.playClickAnimation(); this.clickAction()})
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            if(event.key == " " || event.key == "Enter") {
                this.playClickAnimation()
                this.clickAction()
            }
        })
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.setAttribute("tabindex", "0")
    }

    handleSlotchange() {
        super.connectedCallback();

        let childHeight = this.slottedChildren[0].clientHeight

        this.style.height = childHeight + "px"
        this.style.width = childHeight + "px"
    }

    playClickAnimation() {
        AnimationHelper.pop(this.slottedChildren[0], 200, 1.1)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "icon-cta": iconCTAComponent;
    }
}

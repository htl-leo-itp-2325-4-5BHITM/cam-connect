import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/iconCTA.styles.scss'
import {AnimationHelper} from "../../util/Util"

@customElement('icon-cta')
export class iconCTAComponent extends LitElement {
    @queryAssignedElements() slottedChildren!: Array<HTMLElement>;

    @property() clickAction: () => void = () => {}

    @property() size: string = "1.5rem"

    @property({ type: Boolean, reflect: true })
    disabled?: boolean = false

    render() {
        return html`
            <style>${styles}</style>
            <slot @slotchange=${this.handleSlotchange}></slot>
           `
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.executeClickAction)
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            if(event.key == " " || event.key == "Enter") {
                this.executeClickAction()
            }
        })
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        this.setAttribute("tabindex", "0")

        this.style.height = this.size
        this.style.width = this.size
    }

    handleSlotchange() {
        /*let childHeight = this.slottedChildren[0].clientHeight

        this.style.height = childHeight + "px"
        this.style.width = childHeight + "px"*/
    }

    playClickAnimation() {
        AnimationHelper.pop(this.slottedChildren[0], 200, 1.1)
    }

    executeClickAction(){
        if(this.disabled) return

        this.playClickAnimation()
        this.clickAction()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "icon-cta": iconCTAComponent;
    }
}

import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/rent-status.styles.scss'

export enum RentStatus {CONFIRMED="Bestätigt", WAITING="Warten", DECLINED="Abgelehnt", RETURNED="Zurückgegeben"}

@customElement('cc-rent-status')
export class RentStatusComponent extends LitElement {
    @property({type: RentStatus})
    status?: RentStatus = RentStatus.WAITING

    @property({type: Boolean})
    isBig?: Boolean = false;

    @property({type: Boolean, reflect: true})
    isOpen?: Boolean = false;

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-rent-status" @click="${this.toggleOpen}" status="${this.status}" isBig="${this.isBig}">
                ${this.isBig ? this.status : ""}
            </div>`
    }

    toggleOpen(){

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-status": RentStatusComponent;
    }
}
import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/rent-status.styles.scss'

enum Status {CONFIRMED="Bestätigt", WAITING="Warten", DECLINED="Abgelehnt", RETURNED="Zurückgegeben"}

@customElement('cc-rent-status')
export class RentStatusComponent extends LitElement {
    @property({type: Status})
    status?: Status = Status.WAITING

    @property({type: Boolean})
    isBig?: Boolean = false;

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-rent-status" status="${this.status}" isBig="${this.isBig}">
                ${this.isBig ? Status[this.status] : ""}
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-status": RentStatusComponent;
    }
}
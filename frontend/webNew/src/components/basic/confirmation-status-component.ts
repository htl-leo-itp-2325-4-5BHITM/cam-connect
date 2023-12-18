import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/confirmation-status.styles.scss'

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt", RETURNED="zurückgegeben"}

@customElement('cc-confirmation-status')
export class ConfirmationStatusComponent extends LitElement {
    @property({type: Status})
    status?: Status = Status.WAITING

    @property({type: Boolean})
    isBig?: Boolean = false;

    render() {
        return html`
            <style>${styles}</style>
            <div class="cc-confirmation-status" status="${this.status}" isBig="${this.isBig}">
                ${this.isBig ? this.status.toString() : ""}
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-confirmation-status": ConfirmationStatusComponent;
    }
}
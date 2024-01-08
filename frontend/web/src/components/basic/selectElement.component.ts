import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'
import {SelectComponent} from "./select.component"

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt"}

@customElement('cc-select-element')
export class SelectElementComponent extends LitElement {
    @property({type: Boolean})
    selected?: Boolean = false;

    toggleOption(event) {
        const elem = event.currentTarget;
        console.log(elem)

        if (elem.closest(".select")) { //todo i don't really know how to get out of the shadow root
            const select = elem.closest(".select");
            const activeElement = select.querySelector(".active");
            if (activeElement) {
                activeElement.classList.remove("active");
            }
        }
        (event.target as HTMLElement).classList.add("active");
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="select-element ${this.selected ? "active" : ""}" @click="${this.toggleOption}">
                <p>${this.innerHTML}</p>
            </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-select-element": SelectElementComponent;
    }
}
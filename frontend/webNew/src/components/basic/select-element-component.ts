import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/select.styles.scss'
import {SelectComponent} from "./select-component"

enum Status {CONFIRMED="bestätigt", WAITING="warten", DECLINED="abgelehnt"}

@customElement('cc-select-element')
export class SelectElementComponent extends LitElement {
    @property({type: Boolean})
    selected?: Boolean = false;

    toggleOption(event) { //todo i don't really know how to get back into the shadow root to find the active element
        const elem = event.currentTarget;
        if (elem.closest(".select")) {
            const select = elem.closest(".select");
            const activeElement = select.querySelector(".active");
            if (activeElement) {
                activeElement.classList.remove("active");
            }
            elem.querySelector("select-element").classList.add("active");
        }
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
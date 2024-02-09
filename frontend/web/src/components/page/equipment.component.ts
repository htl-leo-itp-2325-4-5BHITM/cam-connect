import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/page/equipment.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"

@customElement('cc-equipment')
export class RentComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            
            <cc-toolbar page="${PageEnum.EQUIPMENT}"></cc-toolbar>
            <cc-device-list></cc-device-list>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-equipment": RentComponent
    }
}
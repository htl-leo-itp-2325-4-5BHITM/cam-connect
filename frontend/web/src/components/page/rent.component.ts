import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/page/rent.styles.scss'
import {model} from "../../index"
import {ObservedProperty, PageEnum} from "../../model"
import {FilterContainerComponent, FilterOption} from "../basic/filterContainer.component"

@customElement('cc-rent')
export class RentComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable">
            </cc-sidebar>
            <main>
                <cc-toolbar page="${PageEnum.RENTS}"></cc-toolbar>
                <cc-rent-list></cc-rent-list>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent": RentComponent
    }
}
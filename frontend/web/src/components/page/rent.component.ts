import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app.styles.scss'
import {model} from "../../index"
import {ObservedProperty, PageEnum} from "../../model"
import {FilterBlockComponent, FilterOption} from "../basic/filterBlock.component"

@customElement('cc-rent')
export class RentComponent extends LitElement {
    render() {
        let filterElements = {
            resolutions: new FilterBlockComponent("Auflösungen"),
            sensors: new FilterBlockComponent("Sensoren"),
            systems: new FilterBlockComponent("Kameratypen"),
            lensMounts: new FilterBlockComponent("Objektiv Anschlüsse"),
            tripodHeads: new FilterBlockComponent("Stativköpfe")
        }

        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable">
                <cc-filter-block slot="primaryFilters" .options="${model.deviceTypeNameFilterOptions}">Gerätetyp</cc-filter-block>
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
import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/page/equipment.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {ButtonSize} from "../basic/button.component"

@customElement('cc-equipment')
export class RentComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable">
                <cc-filter-container slot="primaryFilters" .options="${model.deviceTypeNameFilterOptions}">Gerätetyp</cc-filter-container>
                <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraResolutions}" .visibility="${["camera", "drone"]}">Auflösungen</cc-filter-container>
                <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraSensors}" .visibility="${["camera"]}">Sensoren</cc-filter-container>
                <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraSystems}" .visibility="${["camera"]}">Kameratypen</cc-filter-container>
                <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.lensMounts}" .visibility="${["camera", "lens"]}">Objektiv Anschlüsse</cc-filter-container>
                <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.tripodHeads}" .visibility="${["tripod"]}">Stativköpfe</cc-filter-container>
            </cc-sidebar>
            <main>
                <cc-toolbar page="${PageEnum.EQUIPMENT}"></cc-toolbar>
                <cc-device-list></cc-device-list>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-equipment": RentComponent
    }
}
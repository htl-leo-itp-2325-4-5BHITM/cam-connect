import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/page/equipment.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {RentStatus} from "../../service/rent.service";
import {ColorEnum} from "../../base";
import {ChipSize} from "../basic/chip.component";
import {ButtonType} from "../basic/button.component";

@customElement('cc-equipment')
export class RentComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable">
                <cc-filter-container slot="primaryFilters" .options="${model.deviceTypeNameFilterOptions}">Gerätetyp</cc-filter-container>
                <cc-filter-container .options="${model.deviceTypeAttributesAsFilterOptions.cameraResolutions}" visibility="${[]}">Auflösungen</cc-filter-container>
                <cc-filter-container .options="${model.deviceTypeAttributesAsFilterOptions.cameraSensors}">Sensoren</cc-filter-container>
                <cc-filter-container .options="${model.deviceTypeAttributesAsFilterOptions.cameraSystems}">Kameratypen</cc-filter-container>
                <cc-filter-container .options="${model.deviceTypeAttributesAsFilterOptions.lensMounts}">Objektiv Anschlüsse</cc-filter-container>
                <cc-filter-container .options="${model.deviceTypeAttributesAsFilterOptions.tripodHeads}">Stativköpfe</cc-filter-container>
            </cc-sidebar>
            <main>
                <cc-toolbar page="${PageEnum.EQUIPMENT}"></cc-toolbar>
                <p>equipement page</p>
                <cc-button type="underlined">Buttoin</cc-button>
                <cc-button type="text">Buttoin</cc-button>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-equipment": RentComponent
    }
}
import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/app.styles.scss'
import {model} from "../index"
import {ObservedProperty, PageEnum} from "../model"
import {KeyBoardShortCut} from "../base"
import {AppState} from "../AppState"

@customElement('cc-app')
export class AppComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)

        model.appState.value.appElement = this
    }

    render() {
        let page = html``
        let sidebar = html``

        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT:
                sidebar = html`
                <cc-sidebar accountname="wird später mal ein observable">
                    <cc-filter-container slot="primaryFilters" .options="${model.deviceTypeNameFilterOptions}">Gerätetyp</cc-filter-container>
                    <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraResolutions}" .visibility="${["camera", "drone"]}">Auflösungen</cc-filter-container>
                    <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraSensors}" .visibility="${["camera"]}">Sensoren</cc-filter-container>
                    <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.cameraSystems}" .visibility="${["camera"]}">Kameratypen</cc-filter-container>
                    <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.lensMounts}" .visibility="${["camera", "lens"]}">Objektiv Anschlüsse</cc-filter-container>
                    <cc-filter-container slot="secondaryFilters" .options="${model.deviceTypeAttributesAsFilterOptions.tripodHeads}" .visibility="${["tripod"]}">Stativköpfe</cc-filter-container>
                </cc-sidebar>
                `
                page = html`<cc-device-list class="content"></cc-device-list>`
                break
            case PageEnum.RENTS:
                page = html`<cc-rent-list class="content"></cc-rent-list>`
                sidebar = html`<cc-sidebar accountname="wird später mal ein observable"></cc-sidebar>`
                break
            case PageEnum.CALENDAR:
                page = html`<cc-calendar class="content"></cc-calendar>`
                sidebar = html`<cc-sidebar accountname="wird später mal ein observable"></cc-sidebar>`
                break
        }

        return html`
            <style>${styles}</style>
            <cc-navbar></cc-navbar>
            ${sidebar}
            <div class="toolbar-container">
                <cc-toolbar></cc-toolbar>
                <cc-create-rent></cc-create-rent>
                ${page}
            </div>
            
            <div id="tooltip"></div>
            <div id="autocompleteSuggestions"></div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-app": AppComponent
    }
}
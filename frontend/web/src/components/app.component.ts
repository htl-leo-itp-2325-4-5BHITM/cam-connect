import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/app.styles.scss'
import {model} from "../index"
import {ObservedProperty, PageEnum} from "../model"
import {KeyBoardShortCut, SimpleColorEnum, SizeEnum} from "../base"
import {AppState} from "../AppState"
import {ButtonType} from "./basic/button.component"
import {BehaviorSubject} from "rxjs"
import {FilterOption} from "./basic/filterContainer.component"
import {OrderByFilterRent, RentStatusEnum} from "../service/rent.service"

@customElement('cc-app')
export class AppComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    private rentStatusFilterOptions = new BehaviorSubject<FilterOption[]>([
        {name: "Warte auf Bestätigung", id: "WAITING"},
        {name: "Bestätigt", id: "CONFIRMED"},
        {name: "Abgelehnt", id: "DECLINED"}
    ] as const)

    private firstGraders = new BehaviorSubject<FilterOption[]>([
        {name: "1AHITM", id: "1AHITM"},
        {name: "1BHITM", id: "1BHITM"},
        {name: "1CHITM", id: "1CHITM"}
    ] as const)

    private secondGraders = new BehaviorSubject<FilterOption[]>([
        {name: "2AHITM", id: "2AHITM"},
        {name: "2BHITM", id: "2BHITM"},
        {name: "2CHITM", id: "2CHITM"}
    ] as const)

    private thirdGraders = new BehaviorSubject<FilterOption[]>([
        {name: "3AHITM", id: "3AHITM"},
        {name: "3BHITM", id: "3BHITM"},
        {name: "3CHITM", id: "3CHITM"}
    ] as const)

    private fourthGraders = new BehaviorSubject<FilterOption[]>([
        {name: "4AHITM", id: "4AHITM"},
        {name: "4BHITM", id: "4BHITM"},
    ] as const)

    private fithGraders = new BehaviorSubject<FilterOption[]>([
        {name: "5AHITM", id: "5AHITM"},
        {name: "5BHITM", id: "5BHITM"},
    ] as const)

    constructor() {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)

        model.appState.value.appElement = this
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        model.appState.value.overlayElement = this.shadowRoot.querySelector("#overlay") as HTMLElement
    }

    render() {
        let page = html``
        let sidebar = html``

        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT:
                sidebar = html`
                <cc-sidebar accountname="Martin Huemer">
                    <cc-select slot="sorts" size="${SizeEnum.MEDIUM}">
                        <p class="selected">raster</p>
                        <p>liste</p>
                    </cc-select>
                    <cc-toggle slot="sorts" onToggle="${(toggled:boolean)=>{
                        if(toggled){
                            
                        }
                    }}">Nur verfügbare anzeigen</cc-toggle>
                    <cc-button slot="sorts" size="${SizeEnum.MEDIUM}" type="${ButtonType.UNDERLINED}" color="${SimpleColorEnum.GRAY}" @click=""
                               noPadding>Filter zurücksetzten
                    </cc-button>
                    
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
                sidebar = html`
                    <cc-sidebar accountname="Martin Huemer">
                        <cc-dropdown slot="sorts" .options="${[
                            {id: OrderByFilterRent.ALPHABETICAL_ASC, data: 'alphabetisch (aufst.)'},
                            {id: OrderByFilterRent.ALPHABETICAL_DESC, data: 'alphabetisch (abst.)'},
                            {id: OrderByFilterRent.DATE_ASC, data: 'datum (neueste zuerst)'},
                            {id: OrderByFilterRent.DATE_DESC, data: 'datum (älteste zuerst)'},
                        ]}"
                            .onSelect="${(option) => {
                                let newFilters = model.appState.value.rentFilters
                                newFilters.orderBy = option.id
                                model.appState.value.rentFilters = newFilters
                            }}"
                        ></cc-dropdown>
                        <cc-button slot="sorts" size="${SizeEnum.MEDIUM}" type="${ButtonType.UNDERLINED}" color="${SimpleColorEnum.GRAY}" noPadding @click="${this.clearFilters}">
                            Filter zurücksetzten
                        </cc-button>
                        
                        <cc-filter-container slot="primaryFilters" .options="${this.rentStatusFilterOptions}" 
                             .onUpdate="${(options: FilterOption[])=> {
                                 let newFilters = model.appState.value.rentFilters 
                                 newFilters.statuses = options.filter(option => option.selected == true).map(option => RentStatusEnum[option.id])
                                 if(newFilters.statuses.length == 0) newFilters.statuses = [RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED, RentStatusEnum.WAITING]
                                 model.appState.value.rentFilters = newFilters
                             }}"
                        >Status</cc-filter-container>
                        
                        <cc-filter-container slot="secondaryFilters" .options="${this.firstGraders}" .onUpdate="${this.handleStudentFilterUpdate}">Erste Klassen</cc-filter-container>
                        <cc-filter-container slot="secondaryFilters" .options="${this.secondGraders}" .onUpdate="${this.handleStudentFilterUpdate}">Zweite Klassen</cc-filter-container>
                        <cc-filter-container slot="secondaryFilters" .options="${this.thirdGraders}" .onUpdate="${this.handleStudentFilterUpdate}">Dritte Klassen</cc-filter-container>
                        <cc-filter-container slot="secondaryFilters" .options="${this.fourthGraders}" .onUpdate="${this.handleStudentFilterUpdate}">Vierte Klassen</cc-filter-container>
                        <cc-filter-container slot="secondaryFilters" .options="${this.fithGraders}" .onUpdate="${this.handleStudentFilterUpdate}">Fünfte Klassen</cc-filter-container>
                    </cc-sidebar>`
                break
            case PageEnum.CALENDAR:
                page = html`<cc-calendar class="content"></cc-calendar>`
                sidebar = html`<cc-sidebar accountname="Martin Huemer"></cc-sidebar>`
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
            <div id="overlay" @click="${this.autoCloseOverlay}">
                <div class="content"></div>
            </div>
        `
    }

    clearFilters(){
        this.shadowRoot.querySelectorAll("cc-filter-container").forEach(filterContainer => {
            filterContainer.clearSelection()
        })
    }

    handleStudentFilterUpdate(options: FilterOption[]){
        let newRentFilters = model.appState.value.rentFilters
        options.forEach(option => {
            if(option.selected){
                newRentFilters.schoolClasses.add(option.id as string)
            }
            else{
                newRentFilters.schoolClasses.delete(option.id as string)
            }
        })
        model.appState.value.rentFilters = newRentFilters
    }

    autoCloseOverlay(event: MouseEvent){
        if(event.composedPath()[0] == this.shadowRoot.querySelector("#overlay")) model.appState.value.closeOverlay()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-app": AppComponent
    }
}
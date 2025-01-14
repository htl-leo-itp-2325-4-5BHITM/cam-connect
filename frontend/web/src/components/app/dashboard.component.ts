import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/dashboard.styles.scss'
import {model} from "../../index"
import {ObservedProperty, PageEnum} from "../../model"
import {SimpleColorEnum, SizeEnum} from "../../base"
import {AppState} from "../../AppState"
import {ButtonType} from "../basic/button.component"
import {BehaviorSubject} from "rxjs"
import {FilterOption} from "../basic/filterContainer.component"
import {OrderByFilterRent, RentStatusEnum} from "../../service/rent.service"
import {KeyBoardShortCut} from "../../util/KeyboardShortcut"
import {UserRoleEnum} from "../../service/user.service"
import {faSquarePlus} from "@fortawesome/free-regular-svg-icons"
import {faBars, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"

@customElement('cc-dashboard')
export class DashboardComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    private rentStatusFilterOptions = new BehaviorSubject<FilterOption[]>([
        {name: "Warte auf Bestätigung", id: "WAITING"},
        {name: "Bestätigt", id: "CONFIRMED"},
        {name: "Abgelehnt", id: "DECLINED"}
    ])

    private firstGraders = new BehaviorSubject<FilterOption[]>([
        {name: "1AHITM", id: "1AHITM"},
        {name: "1BHITM", id: "1BHITM"},
        {name: "1CHITM", id: "1CHITM"}
    ])

    private secondGraders = new BehaviorSubject<FilterOption[]>([
        {name: "2AHITM", id: "2AHITM"},
        {name: "2BHITM", id: "2BHITM"},
        {name: "2CHITM", id: "2CHITM"}
    ])

    private thirdGraders = new BehaviorSubject<FilterOption[]>([
        {name: "3AHITM", id: "3AHITM"},
        {name: "3BHITM", id: "3BHITM"},
        {name: "3CHITM", id: "3CHITM"}
    ])

    private fourthGraders = new BehaviorSubject<FilterOption[]>([
        {name: "4AHITM", id: "4AHITM"},
        {name: "4BHITM", id: "4BHITM"},
    ])

    private fithGraders = new BehaviorSubject<FilterOption[]>([
        {name: "5AHITM", id: "5AHITM"},
        {name: "5BHITM", id: "5BHITM"},
    ])

    constructor() {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        let keyBindsLoaded: boolean = false
        model.appState.value.currentUserLoaded.subscribe((user) => {
            if(model.appState.value.currentUser){
                if(model.appState.value.currentUser.role == UserRoleEnum.MEDT_TEACHER)
                    KeyBoardShortCut.register(model.appState.value.userSettings.keybinds.newRent, () => {model.appState.value.openCreateRentModal()})

                keyBindsLoaded = true
            }
        })

        super.firstUpdated(_changedProperties);
    }

    render() {
        let page = html``
        let sidebar = html``

        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT:
                sidebar = html`
                <cc-sidebar>
                    <cc-select slot="sorts" size="${SizeEnum.MEDIUM}" .onSelect="${(elem) => {
                        model.appState.value.equipmentDisplayMode = elem.dataset['name']
                        model.appState.value.selectedSetEntries.clear()
                        model.appState.value.selectedDeviceEntries.clear()
                    }}">
                        <p class="selected" data-name="grid">raster</p>
                        <p data-name="list">liste</p>
                    </cc-select>
                    <cc-select slot="sorts" size="${SizeEnum.MEDIUM}" .onSelect="${(elem) => {
                        model.appState.value.deviceTypeOrSet = elem.dataset['name']
                        model.appState.value.selectedSetEntries.clear()
                        model.appState.value.selectedDeviceEntries.clear()
                    }}">
                        <p class="selected" data-name="type">geräte-typen</p>
                        <p data-name="set">geräte-sets</p>
                    </cc-select>
                    <cc-toggle slot="sorts" .onToggle="${(toggled:boolean)=>{
                        let newFilters = model.appState.value.deviceFilters
                        newFilters.onlyAvailable = toggled
                        model.appState.value.deviceFilters = newFilters
                    }}">Nur verfügbare anzeigen</cc-toggle>
                    <cc-button 
                        slot="sorts" 
                        size="${SizeEnum.MEDIUM}" 
                        type="${ButtonType.UNDERLINED}" 
                        color="${SimpleColorEnum.GRAY}" 
                        @click="${this.clearFilters}"
                    >Filter zurücksetzten</cc-button>
                    
                    <cc-filter-container slot="primaryFilters" .options="${model.deviceTypeNameFilterOptions}" affectSecondaryFilters .onUpdate="${this.handleDeviceTypeVariantFilterUpdate}">Gerätetyp</cc-filter-container>
                    <cc-filter-container slot="primaryFilters" .options="${model.tagFilterOptions}" .onUpdate="${this.handleDeviceTypeTagFilterUpdate}">Tags</cc-filter-container>
                    
                    <cc-filter-container 
                            slot="secondaryFilters" 
                            .options="${model.deviceTypeAttributesAsFilterOptions.cameraSystems}" 
                            .visibility="${["camera"]}" 
                            .onUpdate="${this.handleDeviceTypeAttributeFilterUpdate}"
                    >Kameratypen</cc-filter-container>
                    <cc-filter-container 
                            slot="secondaryFilters" 
                            .options="${model.deviceTypeAttributesAsFilterOptions.lensMounts}" 
                            .visibility="${["camera", "lens"]}" 
                            .onUpdate="${this.handleDeviceTypeAttributeFilterUpdate}"
                    >Objektiv Anschlüsse</cc-filter-container>
                    <cc-filter-container 
                            slot="secondaryFilters" 
                            .options="${model.deviceTypeAttributesAsFilterOptions.cameraResolutions}" 
                            .visibility="${["camera", "drone"]}"  
                            .onUpdate="${this.handleDeviceTypeAttributeFilterUpdate}"
                    >Foto-Auflösungen</cc-filter-container>
                    <cc-filter-container 
                            slot="secondaryFilters" 
                            .options="${model.deviceTypeAttributesAsFilterOptions.tripodHeads}" 
                            .visibility="${["tripod"]}" 
                            .onUpdate="${this.handleDeviceTypeAttributeFilterUpdate}"
                    >Stativköpfe</cc-filter-container>
                    <cc-filter-container 
                            slot="secondaryFilters" 
                            .options="${model.deviceTypeAttributesAsFilterOptions.audioConnectors}" 
                            .visibility="${["audio", "microphone"]}" 
                            .onUpdate="${this.handleDeviceTypeAttributeFilterUpdate}"
                    >Audio Stecker</cc-filter-container>
                </cc-sidebar>
                `
                page = html`<cc-device-list class="content"></cc-device-list>`
                break
            case PageEnum.RENTS:
                page = html`<cc-rent-list class="content"></cc-rent-list>`
                sidebar = html`
                    <cc-sidebar>
                        <cc-dropdown slot="sorts" .options="${[
                            {id: OrderByFilterRent.ALPHABETICAL_ASC, data: 'alphabetisch (aufst.)'},
                            {id: OrderByFilterRent.ALPHABETICAL_DESC, data: 'alphabetisch (abst.)'},
                            {id: OrderByFilterRent.DATE_ASC, data: 'datum (älteste zuerst)'},
                            {id: OrderByFilterRent.DATE_DESC, data: 'datum (neueste zuerst)'},
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
                        
                        <cc-filter-container 
                            slot="primaryFilters" 
                            .options="${this.rentStatusFilterOptions}" 
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
        }

        return html`
            <style>${styles}</style>
            <cc-navbar></cc-navbar>
            ${this.appState.value.screenWidth == "desktop" ? sidebar : ""}
            
            <div id="tutorial-overlay">
                <div class="background"></div>
                <div class="highlight"></div>
                <div class="description">
                    <p class="text"></p>
                    <div class="buttons">
                        <cc-button @click="${this.cancelTutorial}">cancel tutorial</cc-button>
                        <cc-button @click="${this.nextTutorialStep}">next</cc-button>
                    </div>
                </div>
            </div>
            
            <div class="toolbar-container">
                ${this.appState.value.screenWidth == "mobile" ? sidebar : ""}
                
                ${ model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ?
                    html`
                        ${model.appState.value.screenWidth == "desktop" ? 
                            html`
                                <cc-toolbar></cc-toolbar>
                            ` : html`
                                <div id="mobileBottomBar">
                                    <cc-toolbar></cc-toolbar>   
                                    <div class="mobileBottomNav">
                                        <div @click="${()=>{this.classList.toggle("sidebar-open")}}">
                                            ${unsafeSVG(icon(faBars).html[0])}
                                        </div>
                                        <div @click="${() => {model.appState.value.openCreateRentModal()}}">
                                            ${unsafeSVG(icon(faSquarePlus).html[0])}
                                        </div>
                                        <div>
                                            ${unsafeSVG(icon(faMagnifyingGlass).html[0])}
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                        <cc-create-rent></cc-create-rent>
                    ` : ""
                }

                ${ page }
            </div>
        `
    }

    clearFilters(){
        this.shadowRoot.querySelectorAll("cc-filter-container").forEach(filterContainer => {
            filterContainer.clearVisibleSelection()
        })
        let newDeviceFilters = model.appState.value.deviceFilters
        newDeviceFilters.attributes = new Set()
        newDeviceFilters.tags = new Set()
        newDeviceFilters.variants = new Set()
        model.appState.value.deviceFilters = newDeviceFilters
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

    handleDeviceTypeVariantFilterUpdate(options: FilterOption[]){
        let newDeviceFilters = model.appState.value.deviceFilters
        options.forEach(option => {
            if(option.selected){
                newDeviceFilters.variants.add(option.id as string)
            }
            else{
                newDeviceFilters.variants.delete(option.id as string)
            }
        })
        model.appState.value.deviceFilters = newDeviceFilters
    }

    handleDeviceTypeTagFilterUpdate(options: FilterOption[]){
        let newDeviceFilters = model.appState.value.deviceFilters
        options.forEach(option => {
            if(option.selected){
                newDeviceFilters.tags.add(option.id as number)
            }
            else{
                newDeviceFilters.tags.delete(option.id as number)
            }
        })
        model.appState.value.deviceFilters = newDeviceFilters
    }

    handleDeviceTypeAttributeFilterUpdate(options: FilterOption[]){
        let newDeviceFilters = model.appState.value.deviceFilters
        options.forEach(option => {
            if(option.selected){
                newDeviceFilters.attributes.add(option.id as number)
            }
            else{
                newDeviceFilters.attributes.delete(option.id as number)
            }
        })
        model.appState.value.deviceFilters = newDeviceFilters
    }

    autoCloseOverlay(event: MouseEvent){
        if(event.composedPath()[0] == this.shadowRoot.querySelector("#overlay")) model.appState.value.closeOverlay()
    }

    highlightElement(element: HTMLElement, description: string){
        let overlay = this.shadowRoot.querySelector("#tutorial-overlay") as HTMLElement
        let highlightElement = overlay.querySelector(".highlight") as HTMLElement
        let descriptionElement = overlay.querySelector(".description") as HTMLElement
        let backgroundElement = overlay.querySelector(".background") as HTMLElement

        let offset = 5
        let rect = element.getBoundingClientRect()

        let coords = {
            top: rect.top - offset + "px",
            left: rect.left - offset + "px",
            right: rect.left + rect.width + offset + "px",
            bottom: rect.top + rect.height + offset + "px"
        }

        highlightElement.style.top = rect.top - offset + "px"
        highlightElement.style.left = rect.left - offset + "px"
        highlightElement.style.height = rect.height + offset*2 + "px"
        highlightElement.style.width = rect.width + offset*2 + "px"

        descriptionElement.querySelector("p.text").innerHTML = description
        descriptionElement.style.top = rect.top + "px"
        descriptionElement.style.left = rect.left + rect.width + 20 + "px"

        let cp = `polygon(0% 0%, 0% 100%, ${coords.left} 100%, ${coords.left} ${coords.top}, ${coords.right} ${coords.top}, ${coords.right} ${coords.bottom}, ${coords.left} ${coords.bottom}, ${coords.left} 100%, 100% 100%, 100% 0%)`

        console.log(cp)

        backgroundElement.style.clipPath = cp
    }

    currentTutorialStep = 0
    tutorialSteps = []

    startTutorial(){
        (this.shadowRoot.querySelector("#tutorial-overlay") as HTMLElement).style.display = "block"

        this.tutorialSteps = [
            {element: this.shadowRoot.querySelector("cc-sidebar"), description: "Hier findest du alle Geräte und Gerätesets"},
            {element: this.shadowRoot.querySelector("cc-navbar").shadowRoot.querySelector("cc-select"), description: "wähle page"}
        ]

        this.currentTutorialStep = 0

        this.nextTutorialStep()
    }

    nextTutorialStep(){
        let currentStep = this.tutorialSteps[this.currentTutorialStep]
        console.log(currentStep)
        this.highlightElement(currentStep.element, currentStep.description)
        this.currentTutorialStep++
    }

    cancelTutorial(){
        (this.shadowRoot.querySelector("#tutorial-overlay") as HTMLElement).style.display = "none"
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-dashboard": DashboardComponent
    }
}
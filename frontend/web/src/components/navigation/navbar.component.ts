import {LitElement, css, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/navigation/navbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faMagnifyingGlass,
    faArrowRotateRight,
    faArrowLeft,
    faXmark,
    faHandPointer,
    faTriangleExclamation,
    faBook
} from "@fortawesome/free-solid-svg-icons"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons"
import {model} from "../../index"
import {ColorEnum, SimpleColorEnum, SizeEnum} from "../../base"
import { ObservedProperty, PageEnum} from "../../model"
import { SelectComponent } from "../basic/select.component"
import {AppState} from "../../AppState"
import RentService from "../../service/rent.service"
import UrlHandler from "../../util/UrlHandler"
import logo from "../../../assets/logo/cc-wordmark-white.svg"
import logoSmall from "../../../assets/logo/cc-logomark-accent.svg"
import Util, {AnimationHelper} from "../../util/Util"
import {ButtonType} from "../basic/button.component"
import PopupEngine from "../../util/PopupEngine"
import {KeyBoardShortCut} from "../../util/KeyboardShortcut"
import {Tooltip} from "../../util/Tooltip"
import {DashboardComponent} from "../app/dashboard.component"
import {UserRoleEnum} from "../../service/user.service"

@customElement('cc-navbar')
export class NavbarComponent extends LitElement {
    @property({reflect: true})
    type: "default" | "simple" | "back" = "default"

    @property()
    searchOpen: boolean = false

    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        if(this.type == "simple")
            return html`
                <style>${styles}</style>
                <div class="logo">
                    <img src="${logo}" alt="cam-connect" @click="${()=> UrlHandler.setUrl("/app/rents")}">
                </div>
            `
        else if(this.type == "back")
            return html`
                <style>${styles}</style>
                <cc-button type="${ButtonType.TEXT}" color="${SimpleColorEnum.GRAY}"
                   @click="${()=> {
                        UrlHandler.setUrl(model.appState.value.backUrl)
                    }}"
                   text="Zurück zum Dashboard"
                >
                    <div class="icon" slot="left">${unsafeSVG(icon(faArrowLeft).html[0])}</div>
                </cc-button>
                
                <div class="logo">
                    ${this.appState.value.screenWidth == "mobile" ?
                        html`<img src="${logoSmall}" alt="logo small" @click="${()=> UrlHandler.setUrl("/app/rents")}">` :
                        html`<img src="${logo}" alt="cam-connect" @click="${()=> UrlHandler.setUrl(model.appState.value.backUrl)}">`
                    }
                </div>

                <div class="tools">
                    ${this.generateHelpMenu()}
                </div>
            `

        return html`
            <style>${styles}</style>
            <div class="logo">
                ${this.appState.value.screenWidth == "mobile" ?
                    html`<img src="${logoSmall}" alt="logo small" @click="${()=> UrlHandler.setUrl("/app/rents")}">` :
                    html`<img src="${logo}" alt="cam-connect" @click="${()=> UrlHandler.setUrl("/app/rents")}">`
                }
            </div>

            <cc-select size="${this.appState.value.screenWidth == "desktop" ? SizeEnum.MEDIUM : SizeEnum.BIG}" spacerColor="${SimpleColorEnum.ACCENT}" 
                       .onSelect = "${(elem) => {
                           this.appState.value.page = elem.dataset.page
                           UrlHandler.updateUrl(elem.dataset.page)
                           this.closeSearch()
                       }
            }">
                <p data-page="equipment" class="${this.appState.value.page == PageEnum.EQUIPMENT ? 'selected' : ''}"
                   @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+e oder 1', 1500)}}" 
                   @mouseleave="${()=>{Tooltip.hide(0)}}"
                >Equipment</p>
                <p data-page="rents" class="${this.appState.value.page == PageEnum.RENTS ? 'selected' : ''}"
                   @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+v oder 2', 1500)}}"
                   @mouseleave="${()=>{Tooltip.hide(0)}}"
                >Verleihliste</p>
            </cc-select>

            <div class="tools">
                <div class="search-container">
                    <div class="search ${this.searchOpen ? 'expanded' : ''}">
                        <input type="text" placeholder="suche">
                        ${this.searchOpen ? 
                            html`<icon-cta @click="${this.closeSearch}" class="closeIcon">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>` :
                            html`<icon-cta @click="${() => this.openSearch()}" class="searchIcon"
                                @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+s', 500, 1000)}}" 
                                @mouseleave="${()=>{Tooltip.hide(0)}}"
                            >
                                ${unsafeSVG(icon(faMagnifyingGlass).html[0])}</icon-cta>`
                        }
                    </div>
                </div>
                <!-- <icon-cta @click="${this.reload}" class="reload">${unsafeSVG(icon(faArrowRotateRight).html[0])}</icon-cta> -->
                ${this.generateHelpMenu()}
            </div>
        `
    }

    generateHelpMenu(){
        return html`
            <icon-cta @click="${this.toggleHelpMenu}">${unsafeSVG(icon(faCircleQuestion).html[0])}</icon-cta>
            <div class="helpMenu">
                <a href="https://github.com/htl-leo-itp-2325-4-5bhitm/cam-connect/issues/new" target="_blank">
                    <cc-button type="${ButtonType.TEXT}" color="${ColorEnum.GRAY}">
                        Einen Fehler Melden
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faTriangleExclamation).html[0])}
                        </div>
                    </cc-button>
                </a>
                ${model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ? html`
                    <cc-button type="${ButtonType.TEXT}" @click="${this.startTutorial}" color="${ColorEnum.GRAY}">
                        Tutorial
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faHandPointer).html[0])}
                        </div>
                    </cc-button>
                ` : ""}
                <a href="https://github.com/htl-leo-itp-2325-4-5bhitm/cam-connect" target="_blank">
                    <cc-button type="${ButtonType.TEXT}" color="${ColorEnum.GRAY}">
                        Dokumentation
                        <div slot="left" class="icon accent">
                            ${unsafeSVG(icon(faBook).html[0])}
                        </div>
                    </cc-button>
                </a>
            </div>
        `
    }

    toggleHelpMenu(){
        let menuPopup = this.shadowRoot.querySelector(".helpMenu") as HTMLElement

        AnimationHelper.toggleVisibility(menuPopup, "flex")
    }

    startTutorial(){
        let dashboard = this.appState.value.appElement.shadowRoot.querySelector("cc-dashboard") as DashboardComponent

        dashboard.startTutorial()
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("navbar connectedCallback")
        //INFO
        //this might cause a nasty bug where the event listener is registered multiple times but is fine for now
        //since the nav doesnt change
        if(this.type == "default") {
            KeyBoardShortCut.register(model.appState.value.userSettings.keybinds.equipmentPage, () => {
                this.selectNavItem(0)
            })
            KeyBoardShortCut.register(model.appState.value.userSettings.keybinds.rentPage, () => {
                this.selectNavItem(1)
            })
            KeyBoardShortCut.register(model.appState.value.userSettings.keybinds.search, () => {
                this.openSearch()
            })
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if(UrlHandler.getParam("searchTerm") != "" && UrlHandler.getParam("searchTerm") != null) this.openSearch(UrlHandler.getParam("searchTerm"))
    }

    selectNavItem(pageIndex: number) {
        let select: SelectComponent = this.renderRoot.querySelector("cc-select")
        select.selectOptionByIndex(pageIndex)
    }

    reload(e: Event) { //TODO limit rates
        AnimationHelper.spin(this.shadowRoot.querySelector("icon-cta.reload"))
        RentService.fetchAll()
        PopupEngine.createNotification({text: "Daten wurden aktualisiert", CSSClass: "good"})
    }

    openSearch(searchTerm: string = ""){
        console.log(this.type)
        if(this.type != "default") return

        this.searchOpen = true
        let input = this.shadowRoot.querySelector(".search input") as HTMLInputElement
        if(searchTerm != "" && searchTerm != null) {
            input.value = searchTerm
            this.handleSearchInput()
        }
        input.focus()
        input.addEventListener("keyup", this.handleSearchInput.bind(this))
        model.appState.value.addCurrentActionCancellation(this.closeSearch.bind(this), "search")
    }

    handleSearchInput = Util.debounce(() => {
        let input = this.shadowRoot.querySelector(".search input") as HTMLInputElement
        model.appState.value.searchTerm = input.value
    })

    closeSearch(){
        this.searchOpen = false
        let input = this.shadowRoot.querySelector(".search input") as HTMLInputElement
        input.blur()
        input.value = ""
        model.appState.value.searchTerm = ""
        input.removeEventListener("keyup", this.handleSearchInput.bind(this))
        model.appState.value.removeCurrentActionCancellation("search")
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-navbar": NavbarComponent
    }
}
import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/navbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons"
import {model} from "../../index"
import {KeyBoardShortCut, SimpleColorEnum, SizeEnum, Tooltip} from "../../base"
import {AppState, ObservedProperty, PageEnum} from "../../model"

@customElement('cc-navbar')
export class NavbarComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="logo">
                <img src="assets/logo/cc-wordmark-white.svg" alt="cam-connect">
            </div>

            <cc-select size="${SizeEnum.MEDIUM}" spacerColor="${SimpleColorEnum.ACCENT}" 
                       .optionSelected = "${(elem) => {model.updateAppState({page: elem.dataset.page})}}"
            >
                <p data-page="equipment" class="${this.appState.value.page == PageEnum.EQUIPMENT ? 'selected' : ''}"
                   @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+e oder 1', 1500)}}" 
                   @mouseleave="${()=>{Tooltip.hide(0)}}"
                >Equipment</p>
                <p data-page="rents" class="${this.appState.value.page == PageEnum.RENTS ? 'selected' : ''}"
                   @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+v oder 2', 1500)}}"
                   @mouseleave="${()=>{Tooltip.hide(0)}}"
                >Verleihliste</p>
                <p data-page="calendar" class="${this.appState.value.page == PageEnum.CALENDAR ? 'selected' : ''}"
                   @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+c oder 3', 1500)}}"
                   @mouseleave="${()=>{Tooltip.hide(0)}}"
                >Kalender</p>
            </cc-select>

            <div class="tools">
                <icon-cta>${unsafeSVG(icon(faMagnifyingGlass).html[0])}</icon-cta>
                <icon-cta>${unsafeSVG(icon(faArrowRotateRight).html[0])}</icon-cta>
                <icon-cta>${unsafeSVG(icon(faCircleQuestion).html[0])}</icon-cta>
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        KeyBoardShortCut.register([["shift", "e"], ["1"]], () => {this.selectNavItem(0)})
        KeyBoardShortCut.register([["shift", "v"], ["2"]], () => {this.selectNavItem(1)})
        KeyBoardShortCut.register([["shift", "c"], ["3"]], () => {this.selectNavItem(2)})
    }

    selectNavItem(pageIndex: number) {
        let select = this.renderRoot.querySelector("cc-select")
        select.selectOptionByIndex(pageIndex)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-navbar": NavbarComponent
    }
}
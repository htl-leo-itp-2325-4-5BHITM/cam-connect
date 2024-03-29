import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/navbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons"
import {model} from "../../index"
import {SizeEnum} from "../../base"

@customElement('cc-navbar')
export class NavbarComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <div class="logo">
                <img src="assets/logo/cc-wordmark-white.svg" alt="cam-connect">
            </div>

            <cc-select size="${SizeEnum.MEDIUM}" .optionSelected = "${(elem) => {model.updateAppState({page: elem.dataset.page})}}">
                <p class="selected" data-page="equipment">Equipment</p>
                <p data-page="rents">Verleihliste</p>
                <p data-page="calendar">Kalender</p>
            </cc-select>

            <div class="tools">
                <icon-cta>${unsafeSVG(icon(faMagnifyingGlass).html[0])}</icon-cta>
                <icon-cta>${unsafeSVG(icon(faArrowRotateRight).html[0])}</icon-cta>
                <icon-cta>${unsafeSVG(icon(faCircleQuestion).html[0])}</icon-cta>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-navbar": NavbarComponent
    }
}
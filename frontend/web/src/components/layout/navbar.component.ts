import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/navbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faMagnifyingGlass, faArrowRotateRight, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import {model} from "../../index"

@customElement('cc-navbar')
export class NavbarComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <div class="logo">
                <img src="assets/logo/cc-wordmark-white.svg" alt="cam-connect">
            </div>

            <cc-select .optionSelected = "${(elem) => {model.updatePage(elem.dataset.page)}}">
                <p class="selected" data-page="equipment">Equipment</p>
                <p data-page="rents">Verleihliste</p>
            </cc-select>

            <div class="tools">
                <div class="cta-icon">${unsafeSVG(icon(faMagnifyingGlass).html[0])}</div>
                <div class="cta-icon">${unsafeSVG(icon(faArrowRotateRight).html[0])}</div>
                <div class="cta-icon">${unsafeSVG(icon(faCircleQuestion).html[0])}</div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-navbar": NavbarComponent
    }
}
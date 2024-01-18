import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/navbar.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faMagnifyingGlass, faArrowRotateRight, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"

@customElement('cc-navbar')
export class NavbarComponent extends LitElement {

    @property()
    optionSelected: String = "Equipment"

    render() {
        return html`
            <style>${styles}</style>
            <div class="logo">
                <img src="assets/logo/cc-wordmark-white.svg" alt="cam-connect">
            </div>

            <cc-select .optionSelected = "${(elem) => {this.optionSelected = elem.innerHTML}}">
                <p class="selected">Equipment</p>
                <p>Verleihliste</p>
            </cc-select>

            <div class="tools">
                ${unsafeSVG(icon(faMagnifyingGlass).html[0])}
                ${unsafeSVG(icon(faArrowRotateRight).html[0])}
                ${unsafeSVG(icon(faCircleQuestion).html[0])}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-navbar": NavbarComponent
    }
}
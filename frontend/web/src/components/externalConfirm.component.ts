import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/externalConfirm.styles.scss'
import {model} from "../index"
import {ObservedProperty, PageEnum} from "../model"
import {ColorEnum, KeyBoardShortCut, SimpleColorEnum} from "../base"
import {AppState} from "../AppState"
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

@customElement('cc-external-confirm')
export class ExternalConfirmComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    constructor(studentId: number, ) {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>Bestätigen sie Ihren Verleiheintrag</h1>
                <p class="top">Sie haben folgende unbestätigte Verleihe:</p>
                <ul>
                    <li>
                        <p>Lumix S5 ii • A34</p>
                        <p>02.03.34 - 23.03.12</p>
                        <cc-button color="${ColorEnum.GOOD}"
                                   text="Bestätigen"
                                   type="underlined"
                                   >
                            <div slot="right" class="icon good">
                                ${unsafeSVG(icon(faCheck).html[0])}
                            </div>
                        </cc-button>
                        <cc-button color="${ColorEnum.BAD}"
                                   text="Ablehnen"
                                   type="underlined"
                                   >
                            <div slot="right" class="icon bad">
                                ${unsafeSVG(icon(faXmark).html[0])}
                            </div>
                        </cc-button>
                    </li>
                </ul>
                <div class="button-container">
                    <cc-button color="${ColorEnum.GOOD}"
                        text="Alle Bestätigen"
                    type="filled">
                        <div slot="right" class="icon">
                            ${unsafeSVG(icon(faCheck).html[0])}
                        </div>
                    </cc-button>
                </div>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-external-confirm": ExternalConfirmComponent
    }
}
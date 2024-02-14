import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'

import {ColorEnum, SizeEnum} from "../../base"
import {ButtonType} from "../basic/button.component"
import {AppState, ObservedProperty} from "../../model"
import {model} from "../../index"

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import {Rent} from "../../service/rent.service"

@customElement('cc-create-rent')
export class CreateRentComponent extends LitElement {
    @property({type: Boolean})
    private appState: ObservedProperty<AppState>

    @property()
    rents: Rent[] = []

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let globalInput = this.renderRoot.querySelector('.globaltime input') as HTMLInputElement
        new AirDatepicker(globalInput, {
            locale: localeEn,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            /*visible: true,*/
        })
    }

    render() {
        return html`
            <style>${styles}</style>
            <style>
                :host {
                    max-width: ${this.appState.value.createRentModalOpen ? "50vw" : "0"};
                    opacity: ${this.appState.value.createRentModalOpen ? 1 : 0};
                }
            </style>
            
            <div class="top">
                <h2>Verleih erstellen</h2>
            </div>
            
            <cc-chip>Schüler auswählen • Klasse</cc-chip>
            
            <cc-line></cc-line>
            
            <div class="list">
                <div class="globaltime">
                    Globale Zeit setzen:
                    <div class="dateInputArea">
                        <input type="text" class="date">
                        <icon-cta>${unsafeSVG(icon(faCircleArrowDown).html[0])}</icon-cta>
                    </div>
                </div>
                
                ${this.rents.map(rent => {
                    return html`
                        <div class="device">
                            <div>
                                <input type="text" value="${rent.device.type.name}">
                                <input type="text" value="${rent.device.number}" class="number">
                            </div>

                            <div>
                                <input class="date">
                            </div>

                            <icon-cta>${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                        </div>
                    `
                })}
            </div>

            <div class="addDevice">
                <cc-button class="primary" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}">
                    Gerät Hinzufügen
                </cc-button>
                <cc-button color="${ColorEnum.GRAY}" type="${ButtonType.OUTLINED}">
                    Zubehör
                </cc-button>
            </div>
            
            <div class="bottom">
                <cc-button size="${SizeEnum.BIG}" color="${ColorEnum.ACCENT}" type="${ButtonType.FILLED}" 
                           @click="${this.createRent}"
                >Verleih Erstellen</cc-button>
                <cc-button size="${SizeEnum.BIG}" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" 
                           @click="${()=>{model.updateAppState({createRentModalOpen: false})}}"
                >Abbrechen</cc-button>
            </div>
        `
    }

    connectedCallback() {
        super.connectedCallback();

    }

    createRent() {
        console.log("rent created")
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent": CreateRentComponent
    }
}
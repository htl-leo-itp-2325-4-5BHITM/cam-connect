import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'
import {ColorEnum, SizeEnum} from "../../base"
import {ButtonType} from "../basic/button.component"
import {AppState, ObservedProperty} from "../../model"
import {model} from "../../index"

@customElement('cc-create-rent')
export class CreateRentComponent extends LitElement {
    @property({type: Boolean})
    appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <style>
                :host {
                    width: ${this.appState.value.createRentModalOpen ? "fit-content" : "0"};
                }
            </style>
            
            <div class="top">
                <h2>Verleih erstellen</h2>
            </div>
            
            <cc-chip>Schüler auswählen • Klasse</cc-chip>
            
            <cc-line></cc-line>
            
            <div class="list">
                <div>
                    Globale Zeit setzen:
                    <div>
                        <input type="date">
                        <label for="" class="line">-</label>
                        <input type="date">
                    </div>
                </div>
                <cc-create-device-entry></cc-create-device-entry>
                <cc-create-device-entry></cc-create-device-entry>
                <cc-create-device-entry></cc-create-device-entry>
            </div>

            <cc-button color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}">
                Gerät Hinzufügen
            </cc-button>
            
            
            <div class="bottom">
                <cc-button size="${SizeEnum.BIG}" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" 
                           @click="${()=>{model.updateAppState({createRentModalOpen: false})}}">
                    abbrechen
                </cc-button>
                <cc-button color="${ColorEnum.ACCENT}" type="${ButtonType.FILLED}">Erstellen</cc-button>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent": CreateRentComponent
    }
}
import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent-DeviceEntry.styles.scss'

import {AppState, ObservedProperty} from "../../model"
import {model} from "../../index"

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

export interface CreateRentDeviceEntryData {
    device_id: number
    device_string: string
    rent_start: Date
    rent_end_planned: Date
}

@customElement('cc-create-rent-device-entry')
export class CreateRentComponent extends LitElement {
    @property({type: Boolean})
    private appState: ObservedProperty<AppState>

    @property()
    data: CreateRentDeviceEntryData

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.data = {
            device_id: 0,
            device_string: "",
            rent_end_planned: new Date(),
            rent_start: new Date(),
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let input = this.renderRoot.querySelector('.date') as HTMLInputElement
        console.log(input)
        new AirDatepicker(input, {
            locale: localeEn,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: []
        })
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="left">
                <input type="text" value="${this.data.device_string}" class="name">
                <input type="text" value="00" class="number">
            </div>

            <div class="right">
                <input class="date">
                <icon-cta>${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent-device-entry": CreateRentComponent
    }
}
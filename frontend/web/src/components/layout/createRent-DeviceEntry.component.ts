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
import {CreateRentComponent} from "./createRent.component"

export interface CreateRentDeviceEntryData {
    device_id: number
    device_string: string
    rent_start: Date
    rent_end_planned: Date
}

export type RentDeviceEntryComponentType = "default" | "string"

@customElement('cc-create-rent-device-entry')
export class CreateRentDeviceEntryComponent extends LitElement {
    @property({type: Boolean})
    private appState: ObservedProperty<AppState>

    @property()
    data: CreateRentDeviceEntryData

    @property()
    parent: CreateRentComponent

    @property({reflect: true})
    type: RentDeviceEntryComponentType = "default"

    datePicker: AirDatepicker

    constructor(parent: CreateRentComponent, type: RentDeviceEntryComponentType = "default"){
        super()
        this.type = type
        this.parent = parent
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.data = {
            device_id: 0,
            device_string: "",
            rent_start: new Date(),
            rent_end_planned: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let input = this.renderRoot.querySelector('.date') as HTMLInputElement

        this.datePicker = new AirDatepicker(input, {
            locale: localeEn,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: [this.data.rent_start, this.data.rent_end_planned],
            autoClose: true,
            onSelect: (date) => {this.data.rent_start = date[0]; this.data.rent_end_planned = date[1]}
        })
    }

    render() {
        if(this.type == "string")
            return html`
                <style>${styles}</style>
                <div class="left">
                    <input type="text" value="${this.data.device_string}" class="name" placeholder="Equipment" 
                           @blur="${(e) => {this.data.device_string = e.target.value}}">
                </div>
    
                <div class="right">
                    <input class="date">
                    <icon-cta @click="${() => {this.parent.removeDevice(this)}}">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                </div>
            `

        return html`
            <style>${styles}</style>
            <div class="left">
                <input type="text" value="${this.data.device_string}" class="name" placeholder="Name">
                <input type="text" value="" class="number" placeholder="Nr.">
            </div>

            <div class="right">
                <input class="date">
                <icon-cta @click="${() => {this.parent.removeDevice(this)}}">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent-device-entry": CreateRentDeviceEntryComponent
    }
}
import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent-DeviceEntry.styles.scss'

import {ObservedProperty} from "../../model"
import {model} from "../../index"

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import {CreateRentComponent} from "./createRent.component"
import {CreateRentDTO, RentTypeEnum} from "../../service/rent.service"
import {Api, ccResponse, config} from "../../base"
import {AppState} from "../../service/AppState"

export interface CreateRentDeviceEntryData {
    device_type_id: number
    device_number: string
    device_string: string
    rent_start: Date
    rent_end_planned: Date
}

export type RentDeviceEntryComponentType = "default" | "string"

@customElement('cc-create-rent-device-entry')
export class CreateRentDeviceEntryComponent extends LitElement {
    @property()
    data: CreateRentDeviceEntryData

    @property()
    parent: CreateRentComponent

    //TODO this will eventually be part of the data object as a type enum
    @property({reflect: true})
    type: RentDeviceEntryComponentType = "default"

    datePicker: AirDatepicker

    constructor(parent: CreateRentComponent, type: RentDeviceEntryComponentType = "default"){
        super()
        this.type = type
        this.parent = parent
        this.data = { //TODO yeah we have a general issue with the data structure here.. we have no clue about device_id in the frontend, the create dto needs devicetype and number
            device_number: "",
            device_type_id: -1,
            device_string: "",
            rent_start: new Date(),
            rent_end_planned: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let input = this.renderRoot.querySelector('.date') as HTMLInputElement

        //TODO ask huemer if we want to allow dates in the past
        //there might be a case where someone wants to log a rent that they conducted in the past
        //it probably makes most sense to only allow ones in the future
        //airdatepicker does allow a min value
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
        else if(this.type == "default")
            return html`
                <style>${styles}</style>
                <div class="left">
                    <input type="text" value="" class="name" placeholder="Name" 
                           @blur="${(e) => {this.data.device_type_id = e.target.value}}">
                    <input type="text" value="" class="number" placeholder="Nr." 
                           @blur="${(e) => {this.data.device_number = e.target.value}}">
                </div>
    
                <div class="right">
                    <input class="date">
                    <icon-cta @click="${() => {this.parent.removeDevice(this)}}">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                </div>
            `
    }

    async validate():Promise<boolean> {
        //TODO add error highlighting

        if(this.type == "string"){
            if(this.data.device_string == ""){
                return false
            }
        }
        else if(this.type == "default"){
            if(this.data.device_number == "" || this.data.device_type_id == -1){
                return false
            }
            const anyThingButNumbers = /\D/
            if(anyThingButNumbers.test(String(this.data.device_type_id))) return false
            let response = await fetch(`${config.api_url}/device/validatenumberandtype/${this.data.device_number}/${this.data.device_type_id}`)
            Api.handleHttpError(response.status, response.url)
            let result = await response.json() as ccResponse<boolean>
            if(result.ccStatus) Api.handleCCError(result.ccStatus.statusCode, result.ccStatus.details, "/device/validatenumberandtype")

            if(result.data == false) {
                return false
            }
        }

        return true
    }

    toRentObject(): CreateRentDTO {
        //TODO add support for notes

        if(this.type == "default"){
            return {
                type: RentTypeEnum.DEFAULT,
                student_id: 1,
                teacher_start_id: 1,
                device_type_id: this.data.device_type_id,
                device_number: this.data.device_number,
                note: "",
                rent_start: this.data.rent_start.toISOString(),
                rent_end_planned: this.data.rent_end_planned.toISOString()
            }
        }
        else if(this.type == "string"){
            return {
                type: RentTypeEnum.STRING,
                student_id: 1,
                teacher_start_id: 1,
                device_string: this.data.device_string,
                note: "",
                rent_start: this.data.rent_start.toISOString(),
                rent_end_planned: this.data.rent_end_planned.toISOString()
            }
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent-device-entry": CreateRentDeviceEntryComponent
    }
}
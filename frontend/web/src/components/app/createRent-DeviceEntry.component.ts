import {html, LitElement, PropertyValues, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/createRent-DeviceEntry.styles.scss'

import {ObservedProperty} from "../../model"
import {model} from "../../index"

import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCamera, faHelicopter, faLightbulb, faMicrophone, faXmark, faHashtag} from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import {CreateRentComponent} from "./createRent.component"
import {CreateRentDTO, RentTypeEnum} from "../../service/rent.service"
import {ccResponse, config, DatePickerWrapper, Regex, SimpleOption} from "../../base"
import {AppState} from "../../AppState"
import localeDe from "air-datepicker/locale/de"
import {AutocompleteComponent} from "../basic/autocomplete.component"
import DeviceTypeService, {DeviceType, DeviceTypeSource, DeviceTypeVariantEnum} from "../../service/deviceType.service"
import Util, {AnimationHelper} from "../../util"
import DeviceService, {Device, DeviceDTO, SearchDTO} from "../../service/device.service"

export interface CreateRentDeviceEntryData {
    device_id: number
    device_type_id: number
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

    @property({reflect: true})
    type: RentDeviceEntryComponentType = "default"

    @property()
    appState: ObservedProperty<AppState>

    datePicker: DatePickerWrapper

    selectedDevice: Device

    constructor(parent: CreateRentComponent, type: RentDeviceEntryComponentType = "default", dates?: Date[]){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.type = type
        this.parent = parent
        this.data = {
            device_id: -1,
            device_type_id: -1,
            device_string: "",
            rent_start: dates[0] || new Date(),
            rent_end_planned: dates[1] || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
        this.selectedDevice = {
            device_id: -1,
            note: "",
            number: "",
            serial: "",
            type: null
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let input = this.renderRoot.querySelector('.date') as HTMLInputElement
        this.datePicker = new DatePickerWrapper(input, [this.data.rent_start, this.data.rent_end_planned])
    }

    render() {
        if(this.type == "string")
            return html`
                <style>${styles}</style>
                <div class="left">
                    <input type="text" value="${this.data.device_string}" class="name" placeholder="Gerätename" 
                           @blur="${(e) => {this.data.device_string = e.target.value}}">
                </div>
    
                <div class="right">
                    <input class="date">
                    <icon-cta .clickAction="${() => {this.parent.removeDevice(this)}}">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                </div>
            `
        else if(this.type == "default")
            return html`
                <style>${styles}</style>
                <div class="left">
                    <cc-autocomplete placeholder="Name" class="name" 
                                     .onSelect="${(option: DeviceTypeSource) => {
                                         if(option == null) {
                                             this.data.device_type_id = -1
                                         }
                                         else {
                                             this.data.device_type_id = option.type_id
                                         }
                                         
                                         //if the selected device matches the selected type, do nothing
                                         if (this.data.device_type_id == this.selectedDevice?.type?.type_id || this.data.device_id == -1) return
                                         
                                         //reset the device type
                                         this.data.device_id = -1
                                         let numberInput = this.shadowRoot.querySelector('cc-autocomplete.number') as AutocompleteComponent<DeviceDTO>
                                         numberInput.clear()
                                     }}"
                                     .querySuggestions="${DeviceTypeService.search}"
                                     .iconProvider="${DeviceTypeService.deviceTypeToIcon}"
                                     .contentProvider="${(data: DeviceTypeSource) => {return data.name}}"
                                     allowNoSelection="true"
                    ></cc-autocomplete>
                    <cc-autocomplete placeholder="Nr." class="number" 
                                     .onSelect="${(option: Device) => {
                                         this.data.device_id = option.device_id
                                         this.selectedDevice = option
                                         
                                         if(this.data.device_type_id != -1) return
                                         
                                         let typeInput = this.shadowRoot.querySelector('cc-autocomplete.name') as AutocompleteComponent<DeviceTypeSource>
                                         typeInput.selectSuggestion({id: option.type.type_id, data: option.type})
                                     }}"
                                     .querySuggestions="${(searchTerm) => this.searchForDevice(searchTerm)}"
                                     .iconProvider="${this.provideDeviceIcon}"
                                     .contentProvider="${(data: Device) => {return data.number}}"
                                     .showIcon="${false}"
                    ></cc-autocomplete>
                </div>
    
                <div class="right">
                    <input class="date">
                    <icon-cta .clickAction="${() => {this.parent.removeDevice(this)}}">${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                </div>
            `
    }

    //TODO re write the validation system to be less chaotic and work cleaner
    //should also imediatly be validated when both are entered
    validate() {
        let result = true
        if(this.type == "default") {
            if(this.data.device_type_id < 0) {
                this.highlightError(this.shadowRoot.querySelector('cc-autocomplete.name'))
                result = false
            }
            if(this.data.device_id < 0) {
                this.highlightError(this.shadowRoot.querySelector('cc-autocomplete.number'))
                result = false
            }
        }
        else if(this.type == "string" && this.data.device_string == "") {
            this.highlightError(this.shadowRoot.querySelector('.name'))
            result = false
        }

        return result
    }

    highlightError(input: Element){
        input.classList.add("error")
        AnimationHelper.shake(input)
        input.addEventListener("focus", () => {input.classList.remove("error")})

        //TODO auto remove when selecting id
    }

    removeErrorHighlighting(){
        this.shadowRoot.querySelectorAll(".error").forEach((elem) => {
            elem.classList.remove("error")
        })
    }

    async searchForDevice(searchTerm: string): Promise<SimpleOption<number, Device>[]> {
        let searchDTO: SearchDTO = {
            searchTerm: searchTerm,
            typeId: this.data.device_type_id,
            onlyAvailable: true
        }

        return DeviceService.search(searchDTO)
    }

    //TODO find better icon here
    provideDeviceIcon(data: DeviceDTO){
        return html`${unsafeSVG(icon(faHashtag).html[0])}`
    }

    toRentObject(studentId: number): CreateRentDTO {
        //TODO add support for notes
        //TODO get teacher id from user system

        if(this.type == "default"){
            return {
                type: RentTypeEnum.DEFAULT,
                student_id: studentId,
                teacher_start_id: 1,
                device_id: this.data.device_id,
                note: "",
                rent_start: Util.formatDateForDb(this.datePicker.instance.selectedDates[0]),
                rent_end_planned: Util.formatDateForDb(this.datePicker.instance.selectedDates[1])
            }
        }
        else if(this.type == "string"){
            return {
                type: RentTypeEnum.STRING,
                student_id: studentId,
                teacher_start_id: 1,
                device_string: this.data.device_string,
                note: "",
                rent_start: Util.formatDateForDb(this.datePicker.instance.selectedDates[0]),
                rent_end_planned: Util.formatDateForDb(this.datePicker.instance.selectedDates[1])
            }
        }
    }

    setDate(from: Date, to: Date){
        AnimationHelper.pop(this.shadowRoot.querySelector(".date"))
        this.datePicker.instance.selectDate(
            [from, to]
        )
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent-device-entry": CreateRentDeviceEntryComponent
    }
}
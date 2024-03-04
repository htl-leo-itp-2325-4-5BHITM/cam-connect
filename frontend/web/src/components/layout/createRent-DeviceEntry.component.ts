import {html, LitElement, PropertyValues, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent-DeviceEntry.styles.scss'

import {ObservedProperty} from "../../model"
import {model} from "../../index"

import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCamera, faHelicopter, faLightbulb, faMicrophone, faXmark, faHashtag} from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import {CreateRentComponent} from "./createRent.component"
import {CreateRentDTO, RentTypeEnum} from "../../service/rent.service"
import {Api, ccResponse, config, Regex} from "../../base"
import {AppState} from "../../AppState"
import localeDe from "air-datepicker/locale/de"
import {AutocompleteComponent, AutocompleteOption} from "../basic/autocomplete.component"
import {DeviceType, DeviceTypeMinimalDTO, DeviceTypeVariantEnum} from "../../service/deviceType.service"
import Util, {DatePickerWrapper} from "../../util"
import {Device, DeviceDTO} from "../../service/device.service"

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

    @property()
    appState: ObservedProperty<AppState>

    datePicker: DatePickerWrapper

    constructor(parent: CreateRentComponent, type: RentDeviceEntryComponentType = "default"){
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.type = type
        this.parent = parent
        this.data = {
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
        this.datePicker = new DatePickerWrapper(input)
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
                                     .onSelect="${(option: DeviceTypeMinimalDTO) => {
                                         this.data.device_type_id = option.type_id; this.data.device_number = ""
                                         let numberInput = this.shadowRoot.querySelector('cc-autocomplete.number') as AutocompleteComponent<DeviceDTO>
                                         numberInput.clear()
                                     }}"
                                     .querySuggestions="${this.searchForDeviceType}"
                                     .iconProvider="${this.provideDeviceTypeIcon}"
                                     .contentProvider="${(data: DeviceTypeMinimalDTO) => {return data.name}}"
                    ></cc-autocomplete>
                    <cc-autocomplete placeholder="Nr." class="number" 
                                     .onSelect="${(option: DeviceDTO) => {this.data.device_number = String(option.type_id)}}"
                                     .querySuggestions="${(searchTerm) => this.searchForDevice(searchTerm)}"
                                     .iconProvider="${this.provideDeviceIcon}"
                                     .contentProvider="${(data: DeviceDTO) => {return data.number}}"
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
    async validate():Promise<boolean> {
        this.shadowRoot.querySelectorAll("input").forEach((input)=>{
            input.classList.remove("error")
            input.removeEventListener("blur", this.boundValidateInput)
        })
        console.log("validating")

        if(this.type == "string"){
            if(Regex.onlySpecialChars.test(this.data.device_string)){
                this.highlightInputError(this.shadowRoot.querySelector(".name"))
                return false
            }
        }
        else if(this.type == "default"){
            if(
                Regex.empty.test(String(this.data.device_type_id)) ||
                Regex.anyThingButNumbers.test(String(this.data.device_type_id)) ||
                this.data.device_type_id < 0
            ) {
                console.log(this.data.device_type_id)
                this.highlightInputError(this.shadowRoot.querySelector(".name"))
                return false
            }

            if(Regex.onlySpecialChars.test(this.data.device_number)){
                this.highlightInputError(this.shadowRoot.querySelector(".number"))
                return false
            }

            let isValid = await Api.fetchData<boolean>(`/device/validatenumberandtype/${this.data.device_number}/${this.data.device_type_id}`)

            if(isValid == false) {
                this.highlightInputError(this.shadowRoot.querySelector(".number"))
                this.highlightInputError(this.shadowRoot.querySelector(".name"))
                return false
            }
        }

        return true
    }

    /**
     * These functions have a fixed reference to "this" set to the instance of this class
     * when using these in eventlisteners, even though js would normally change "this" to the
     * Element that the event is bound to, these have a fixed reference to the instance of this class
     * See instantiation in the constructor.
     * https://javascript.info/bind
     */
    boundValidateInput = this.validateInput.bind(this);
    boundRemoveErrorHighlighting = this.removeErrorHighlighting.bind(this);
    highlightInputError(input: Element){
        input.classList.add("error");
        input.addEventListener("keydown", this.boundRemoveErrorHighlighting);
        input.addEventListener("blur", this.boundValidateInput);
    }

    /**
     * Remove the error highlighting from the input as soon as the input is edited
     * Also removes the event listener for itself.
     * @param e
     */
    removeErrorHighlighting(e: Event){
        let input = e.target as Element;
        input.classList.remove("error");
        input.removeEventListener("keydown", this.boundRemoveErrorHighlighting);
    }

    validateInput(e: Event){
        this.validate();
    }

    async searchForDeviceType(searchTerm: string): Promise<AutocompleteOption<DeviceTypeMinimalDTO>[]> {
        try {
            const result: ccResponse<AutocompleteOption<DeviceTypeMinimalDTO>[]> = await Api.postData(
                "/devicetype/search",
                {searchTerm: searchTerm}
            )
            return result.data
        } catch (e) {
            console.error(e)
            return []
        }
    }

    async searchForDevice(searchTerm: string): Promise<AutocompleteOption<DeviceDTO>[]> {
        if(this.data.device_type_id < 0) return []
        try {
            const result: ccResponse<AutocompleteOption<DeviceDTO>[]> = await Api.postData(
                `/device/searchwithtype/${this.data.device_type_id}`,
                {searchTerm: searchTerm}
            )
            //can be undefined if type id is -1
            return result.data || []
        } catch (e) {
            console.error(e)
            return []
        }
    }

    provideDeviceTypeIcon(data: DeviceTypeMinimalDTO): TemplateResult {
        switch (data.variant){
            case DeviceTypeVariantEnum.camera: return html`${unsafeSVG(icon(faCamera).html[0])}`
            case DeviceTypeVariantEnum.microphone: return html`${unsafeSVG(icon(faMicrophone).html[0])}`
            case DeviceTypeVariantEnum.drone: return html`${unsafeSVG(icon(faHelicopter).html[0])}`
            case DeviceTypeVariantEnum.lens:
            case DeviceTypeVariantEnum.light: return html`${unsafeSVG(icon(faLightbulb).html[0])}`
            case DeviceTypeVariantEnum.stabilizer:
            case DeviceTypeVariantEnum.tripod: return html`T`
            default: return html`Icon`
        }
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
                device_type_id: this.data.device_type_id,
                device_number: this.data.device_number,
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
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent-device-entry": CreateRentDeviceEntryComponent
    }
}
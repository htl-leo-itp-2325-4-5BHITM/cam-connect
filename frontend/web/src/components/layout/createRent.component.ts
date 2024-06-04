import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'

import {
    Api,
    ccResponse,
    ColorEnum,
    DatePickerWrapper,
    SimpleColorEnum,
    SimpleOption,
    SizeEnum,
    Tooltip
} from "../../base"
import {ButtonType} from "../basic/button.component"
import {ObservedProperty} from "../../model"
import {model} from "../../index"

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import {faXmark, faCircleArrowDown, faUser} from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import localeDe from 'air-datepicker/locale/de';
import {CreateRentDeviceEntryComponent, RentDeviceEntryComponentType} from "./createRent-DeviceEntry.component"
import PopupEngine from "../../popupEngine"
import RentService, {CreateRentDTO} from "../../service/rent.service"
import {AppState} from "../../AppState"
import {AutocompleteComponent} from "../basic/autocomplete.component"
import {Student} from "../../service/student.service"
import Util, {AnimationHelper} from "../../util"

@customElement('cc-create-rent')
export class CreateRentComponent extends LitElement {
    @property()
    student_id: number = -1

    devices: Set<CreateRentDeviceEntryComponent> = new Set()

    globalDatePicker: DatePickerWrapper

    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        let globalInput = this.renderRoot.querySelector('.globaltime input') as HTMLInputElement
        this.globalDatePicker = new DatePickerWrapper(globalInput)

        this.appState.value.createRentElement = this
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

            <cc-autocomplete placeholder="Schüler" class="studentSelector" color="${SimpleColorEnum.ACCENT}" size="${SizeEnum.MEDIUM}"
                             .onSelect="${(student: Student) => {this.student_id = student.student_id}}"
                             .querySuggestions="${this.searchForStudent}"
                             .iconProvider="${()=>{return html`${unsafeSVG(icon(faUser).html[0])}`}}" 
                             .contentProvider="${(data: Student) => {return `${data.firstname} ${data.lastname} • ${data.school_class}`}}"
            ></cc-autocomplete>
            
            <cc-line></cc-line>
            
                <div class="globaltime">
                    Globale Zeit setzen:
                    <div class="dateInputArea">
                        <input type="text" class="date">
                        <icon-cta .clickAction="${() => this.setGlobaldate()}">${unsafeSVG(icon(faCircleArrowDown).html[0])}</icon-cta>
                    </div>
                </div>
                
                <div class="deviceList"></div>
            <div class="list">
            </div>

            <div class="buttons">
                <cc-button class="primary" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" 
                           @click="${() => {this.addDevice('default')}}"
                           @mouseenter="${(e) => {Tooltip.show(e.target, 'shift+g', 1000)}}"
                           @mouseleave="${()=>{Tooltip.hide(0)}}"
                >
                    Gerät Hinzufügen
                </cc-button>
                <cc-button color="${ColorEnum.GRAY}" type="${ButtonType.OUTLINED}" @click="${() => {this.addDevice('string')}}">
                    Zubehör
                </cc-button>
            </div>
            
            <div class="bottom">
                <cc-button size="${SizeEnum.BIG}" color="${ColorEnum.ACCENT}" type="${ButtonType.FILLED}" 
                           @click="${this.create}"
                >Verleih Erstellen</cc-button>
                <cc-button size="${SizeEnum.BIG}" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" 
                           @click="${this.cancel}"
                >Abbrechen</cc-button>
            </div>
        `
    }

    addDevice(type: RentDeviceEntryComponentType = "default", setFocus = true) {
        //TODO passing the global date is a setting
        let newDevice = new CreateRentDeviceEntryComponent(this, type, this.globalDatePicker.instance.selectedDates)
        this.devices.add(newDevice)
        this.shadowRoot.querySelector(".deviceList").appendChild(newDevice)

        if(setFocus)
        window.requestAnimationFrame(()=>{
            if(type == "default") {
                let autocomp = newDevice.shadowRoot.querySelector("cc-autocomplete") as AutocompleteComponent<any>
                autocomp?.setFocus()
            } else {
                let input = newDevice.shadowRoot.querySelector("input") as HTMLInputElement
                input.focus()
            }
        })
    }

    removeDevice(device: CreateRentDeviceEntryComponent) {
        this.devices.delete(device)

        if(this.devices.size == 0) {
            device.remove();
            this.addDevice()
        }
        else
            device.remove()
            //AnimationHelper.remove(device)
    }

    setGlobaldate() {
        let delay = 0
        this.devices.forEach((device) => {
            setTimeout(() => {
                device.setDate(this.globalDatePicker.instance.selectedDates[0], this.globalDatePicker.instance.selectedDates[1])
            },delay+=50)
        })
    }

    async create() {
        let data: CreateRentDTO[] = []
        let valid = true

        if(this.student_id < 0) {
            this.highlightError(this.shadowRoot.querySelector(".studentSelector"))
            valid = false
        }

        for (let i = 0; i < this.devices.size; i++) {
            let device = Array.from(this.devices)[i]

            if(device.validate()) data.push(device.toRentObject(this.student_id))
            else valid = false
        }

        if(!valid) return

        model.appState.value.removeCurrentActionCancellation("createRentModal")

        RentService.create(data)
    }

    highlightError(input: Element){
        input.classList.add("error")
        AnimationHelper.shake(input)
        input.addEventListener("focus", () => {input.classList.remove("error")})
    }

    cancel(){
        console.log(this)

        PopupEngine.createModal({
            heading: "Verleih erstellen abbrechen",
            text: "Möchtest du den Vorgang wirklich abbrechen? Alle eingegebenen Daten gehen verloren.",
            buttons: [
                {
                    text: "Ja",
                    action: () => {
                        this.close()
                        this.appState.value.removeCurrentActionCancellation("createRentModal")
                    },
                    role: "confirm"
                },
                {
                    text: "Nein",
                    action: () => {
                        this.appState.value.removeCurrentActionCancellation("popup")
                    },
                    role: "cancel"
                },
            ]
        })
    }

    close(){
        this.appState.value.closeCreateRentModal()
        this.devices.forEach(device => device.remove())
        this.devices.clear()
        let studentSelector = this.shadowRoot.querySelector("cc-autocomplete.studentSelector") as AutocompleteComponent<Student>
        studentSelector.clear(false)
        this.student_id = -1
        this.shadowRoot.querySelector(".studentSelector")?.classList.remove("error")

        Util.deepEventFocusedElement()?.blur() //removes focus on possible input thats still targeted and preventing the user from using keyboard shortcuts
    }

    async searchForStudent(searchTerm: string): Promise<SimpleOption<number, Student>[]> {
        try {
            const result: ccResponse<SimpleOption<number, Student>[]> = await Api.postData("/student/search", {searchTerm: searchTerm})
            return result.data
        } catch (e) {
            console.error(e)
            return []
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent": CreateRentComponent
    }
}
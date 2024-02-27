import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'

import {Api, ccResponse, ColorEnum, SimpleColorEnum, SizeEnum} from "../../base"
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
import {AutocompleteOption} from "../basic/autocomplete.component"
import {Student} from "../../service/student.service"

@customElement('cc-create-rent')
export class CreateRentComponent extends LitElement {
    @property()
    student_id: number

    devices: Set<CreateRentDeviceEntryComponent> = new Set()

    globalDatePicker: AirDatepicker

    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        let globalInput = this.renderRoot.querySelector('.globaltime input') as HTMLInputElement
        this.globalDatePicker = new AirDatepicker(globalInput, {
            locale: localeDe,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)],
            autoClose: true,
            moveToOtherMonthsOnSelect: false,
            toggleSelected: false,
            /*visible: true,*/
            onShow: (finished) => {
                if(finished) return //onShow gets called twice, once on animation start and a second time on animation end
                //the datepicker handles its own close by esc, to prevent another close action from getting called this dummy is added
                this.appState.value.addCurrentActionCancellation(()=>{}, "datepicker")
            },
            onHide: () => {
                //needs to be in a timeout to make sure that the cancelCurrentAction shortcut was called before showing
                setTimeout(() => {
                    this.appState.value.removeCurrentActionCancellation("datepicker")
                    if(this.globalDatePicker.selectedDates.length <= 1){//forces user to select an actual range of dates
                        this.globalDatePicker.show()
                    }
                },100)
            }
        })
        this.addDevice()
        this.appState.value.createRentComponent = this
        console.log(this.appState.value.createRentComponent)
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
                             .onSelect="${(id:number) => {this.student_id = id}}"
                             .querySuggestions="${this.searchForStudent}"
                             .iconProvider="${()=>{return html`${unsafeSVG(icon(faUser).html[0])}`}}" 
                             .contentProvider="${(data: Student) => {return `${data.firstname} ${data.lastname} • ${data.school_class}`}}"
            ></cc-autocomplete>
            
            <cc-line></cc-line>
            
            <div class="list">
                <div class="globaltime">
                    Globale Zeit setzen:
                    <div class="dateInputArea">
                        <input type="text" class="date">
                        <icon-cta @click="${this.setGlobaldate}">${unsafeSVG(icon(faCircleArrowDown).html[0])}</icon-cta>
                    </div>
                </div>
                
                <div class="deviceList"></div>
            </div>

            <div class="buttons">
                <cc-button class="primary" color="${ColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" @click="${() => {this.addDevice('default')}}">
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

    //TODO add shortcut for this
    //we might want to pass the currently selected global date to the new device
    addDevice(type: RentDeviceEntryComponentType = "default") {
        console.log("adding")
        let newDevice = new CreateRentDeviceEntryComponent(this, type)
        this.devices.add(newDevice)
        this.shadowRoot.querySelector(".deviceList").appendChild(newDevice)
    }

    removeDevice(device: CreateRentDeviceEntryComponent) {
        this.devices.delete(device)
        device.remove()

        if(this.devices.size == 0) this.addDevice()

        console.log(this.devices)
    }

    setGlobaldate() {
        this.devices.forEach(device => {
            device.datePicker.selectDate([this.globalDatePicker.selectedDates[0], this.globalDatePicker.selectedDates[1]])
        })
    }

    async create() {
        let data: CreateRentDTO[] = []

        for (let i = 0; i < this.devices.size; i++) {
            let device = Array.from(this.devices)[i]

            if(await device.validate()) data.push(device.toRentObject())
        }

        if(data.length == 0) return

        RentService.create(data)
    }

    cancel(){
        console.log(this)
        this.appState.value.addCurrentActionCancellation(()=>{
            PopupEngine.closeModal(true, () => {this.appState.value.removeCurrentActionCancellation("popup")})
        }, "popup")

        PopupEngine.createModal({
            heading: "Verleih erstellen abbrechen",
            text: "Möchtest du den Vorgang wirklich abbrechen? Alle eingegebenen Daten gehen verloren.",
            buttons: [
                {text: "Ja", action: () => {
                        this.close()
                        this.appState.value.removeCurrentActionCancellation("createRentModal")
                    }
                },
                {text: "Nein", action: () => {
                        this.appState.value.removeCurrentActionCancellation("popup")
                    }}
            ]
        })
    }

    close(){
        this.appState.value.closeCreateRentModal()
        this.devices.forEach(device => device.remove())
        this.devices.clear()
        this.addDevice()
    }

    async searchForStudent(searchTerm: string): Promise<AutocompleteOption<Student>[]> {
        try {
            const result: ccResponse<AutocompleteOption<Student>[]> = await Api.postData("/student/search", {searchTerm: searchTerm})
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
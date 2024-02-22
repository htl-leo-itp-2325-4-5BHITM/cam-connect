import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../../../styles/components/layout/createRent.styles.scss'

import {Api, ColorEnum, SizeEnum} from "../../base"
import {ButtonType} from "../basic/button.component"
import {ObservedProperty} from "../../model"
import {model} from "../../index"

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons"

import AirDatepicker from 'air-datepicker';
import localeDe from 'air-datepicker/locale/de';
import {CreateRentDeviceEntryComponent, RentDeviceEntryComponentType} from "./createRent-DeviceEntry.component"
import PopupEngine from "../../popupEngine"
import {CreateRentDTO} from "../../service/rent.service"
import {AppState} from "../../service/AppState"

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
            selectedDates: [new Date('January 29, 2024'), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)],
            autoClose: true,
            moveToOtherMonthsOnSelect: false,
            toggleSelected: false,
            /*visible: true,*/
            onHide: () => {
                if(this.globalDatePicker.selectedDates.length <= 1) this.globalDatePicker.show()
            }
        })
        this.addDevice()
        this.appState.value.createRentComponent = this
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
                           @click="${this.createRent}"
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

    async createRent() {
        let data: CreateRentDTO[] = []

        for (let i = 0; i < this.devices.size; i++) {
            let device = Array.from(this.devices)[i]

            let isValid = await device.validate()
            if(!isValid) return
            data.push(device.toRentObject())
            console.log("adding")
        }

        if(data.length == 0) return

        console.log(data)
        Api.createItem<CreateRentDTO[]>("/rent", data).then(result => {
            console.log(result)
            this.close()
        })

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
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-create-rent": CreateRentComponent
    }
}
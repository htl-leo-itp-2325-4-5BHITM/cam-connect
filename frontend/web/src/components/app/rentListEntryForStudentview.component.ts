import {html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import {ColorEnum, SizeEnum} from "../../base"
import RentService, {Rent, RentStatusEnum, RentTypeEnum} from "../../service/rent.service";
import {model} from "../../index"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import Util from "../../util/Util"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import PopupEngine from "../../util/PopupEngine"
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons"

import styles from '../../../styles/components/app/rentListEntryForStudentview.styles.scss'

@customElement('cc-rent-list-entry-for-student')
export class RentListEntryForStudentviewComponent extends LitElement {
    @property()
    rent: Rent

    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    protected performUpdate() {
        super.performUpdate();
        this.setAttribute("status", this.rent.status)
    }

    render() {
        let name = ""
        if (this.rent.type == RentTypeEnum.STRING) {
            name = this.rent.device_string
        } else {
            name = this.rent.device.type.name + " • " + this.rent.device.number
        }

        let chipColor = ColorEnum.GRAY
        let chipText = ""
        switch (this.rent.status) {
            case RentStatusEnum.CONFIRMED:
                chipColor = ColorEnum.GOOD
                chipText = "Bestätigt"
                break
            case RentStatusEnum.WAITING:
                chipColor = ColorEnum.MID
                chipText = "Warte auf Bestätigung"
                break
            case RentStatusEnum.DECLINED:
                chipColor = ColorEnum.BAD
                chipText = "Abgelehnt"
                break
            case RentStatusEnum.RETURNED:
                chipText = "Zurückgegeben"
                break
        }

        return html`
            <style>${styles}</style>
            
            <div>
                <p>${name}</p>
                <p class="date">${this.rent.rent_start} - ${this.rent.rent_end_planned}</p>
                <cc-property-value size="${SizeEnum.SMALL}" property="Erstellt von"
                                   value="${this.rent.teacher_start?.firstname.charAt(0)}. ${this.rent.teacher_start?.lastname}">
                </cc-property-value>
            </div>
            ${this.rent.status == RentStatusEnum.WAITING ?
                    html`
                        <cc-button color="${ColorEnum.GOOD}"
                                   text="Bestätigen"
                                   type="underlined"
                                   @click=${this.acceptRent}
                                   noPadding
                                   loading
                        >
                            <div slot="right" class="icon good">
                                ${unsafeSVG(icon(faCheck).html[0])}
                            </div>
                        </cc-button>
                        <cc-button color="${ColorEnum.BAD}"
                                   text="Ablehnen"
                                   type="underlined"
                                   @click="${() => this.declineRent(name)}"
                                   noPadding
                                   loading
                        >
                            <div slot="right" class="icon bad">
                                ${unsafeSVG(icon(faXmark).html[0])}
                            </div>
                        </cc-button>
                    ` :
                    html`
                        <cc-chip color="${chipColor}" 
                                 size="${SizeEnum.BIG}"
                                 text="${chipText}">
                        </cc-chip>
                    `
            }
        `
    }

    acceptRent(){
        RentService.confirm(this.rent.rent_id)
    }

    declineRent(name){
        PopupEngine.createModal({
            heading: "Verleih ablehnen",
            text: `Warum möchtest du den Verleih von: ${name} ablehnen?`,
            inputs: [
                {
                    type: "text",
                    placeholder: "Ablehnungsgrund",
                }
            ],
            buttons: [
                {
                    text: "Ablehnen",
                    role: "confirm",
                    action: (data) => {
                        console.log(data)
                        RentService.decline(this.rent.rent_id, data.inputValues[0] as string)
                    }
                },
                {
                    text: "Abbrechen",
                    role: "cancel"
                }
            ]
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list-entry-for-student": RentListEntryForStudentviewComponent
    }
}
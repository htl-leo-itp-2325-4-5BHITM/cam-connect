import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/externalConfirm.styles.scss'
import {model} from "../index"
import {ObservedProperty} from "../model"
import {ColorEnum} from "../base"
import {AppState} from "../AppState"
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import RentService, {Rent, RentStatusEnum, RentTypeEnum} from "../service/rent.service"
import UrlHandler from "../util/UrlHandler"
import PopupEngine from "../util/PopupEngine"
import Util from "../util/Util"
import {Api} from "../util/Api"

@customElement('cc-external-confirm')
export class ExternalConfirmComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    @property() rents: Rent[] = []
    @property() rentConfirmationCodes: string[] = []

    constructor(studentId: number, ) {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)

        this.queryUrlData()
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>Hallo ${this.rents[0] ? this.rents[0]?.student.firstname : "name not found"}</h1>
                <p class="top">Du hast folgende unbestätigte Verleihe:</p>
                <ul>
                    ${
                        this.rents.map((rent, i) => {
                            let name = ""
                            if(rent.type == RentTypeEnum.STRING){
                                name = rent.device_string
                            }
                            else{
                                name = rent.device.type.name + " • " + rent.device.number
                            }
                            return html`
                                <li>
                                    <div>
                                        <p>${name}</p>
                                        <p class="date">${rent.rent_start} - ${rent.rent_end_planned}</p>
                                    </div>
                                    ${rent.status == RentStatusEnum.WAITING ? 
                                        html`
                                            <cc-button color="${ColorEnum.GOOD}"
                                                text="Bestätigen"
                                                type="underlined"
                                                @click=${() => {
                                                    RentService.updateStatus(rent.rent_id, this.rentConfirmationCodes[i], RentStatusEnum.CONFIRMED, "")
                                                            .then((success) => {
                                                                if(success){
                                                                    rent.status = RentStatusEnum.CONFIRMED
                                                                    this.requestUpdate()
                                                                }
                                                            })
                                                        }}
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
                                                    @click="${() => {
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
                                                                    RentService.updateStatus(
                                                                            rent.rent_id, this.rentConfirmationCodes[i],
                                                                            RentStatusEnum.DECLINED,
                                                                            data.inputValues[0] as string
                                                                    ).then((success) => {
                                                                        if(success){
                                                                            rent.status = RentStatusEnum.DECLINED
                                                                            this.requestUpdate()
                                                                        }
                                                                    })
                                                                }
                                                            },
                                                            {
                                                                text: "Abbrechen",
                                                                role: "cancel"
                                                            }
                                                        ]
                                                    })
                                                }}" 
                                               noPadding
                                               loading
                                            >
                                                <div slot="right" class="icon bad">
                                                    ${unsafeSVG(icon(faXmark).html[0])}
                                                </div>
                                            </cc-button>
                                            ` :
                                            html`
                                                <p class="done">${Util.rentStatusToHuman(rent.status)}</p>
                                                ${Util.rentStatusToIcon(rent.status)}
                                            `
                                        }
                                </li>
                            `
                        })
                    }
                </ul>
                <div class="button-container">
                    <cc-button @click="${() => {UrlHandler.setUrl("/app/rents")}}">
                        Zurück zur Verleihliste
                    </cc-button>
                </div>
            </main>
        `
    }

    async queryUrlData(){
        this.rentConfirmationCodes = UrlHandler.getParam("codes")?.split(",") || []
        let rentIds = UrlHandler.getParam("ids")?.split(",") || []

        if(!rentIds || rentIds.length == 0) return

        this.rents = (await Api.fetchData<Rent[]>(`/rent/getbyidlist/${rentIds.join(",")}`)).data || []

        let invalidCodes = await this.validateConfirmationCodes()

        if(this.rentConfirmationCodes.length != this.rents.length || this.rents.length == 0) { //the url structure is not correct
            //TODO link with custom feedback system
            if(invalidCodes){ //the length of the rents can be 0 because of this, in that case its likely because the user kept the window open while a new code was generated
                PopupEngine.createModal({
                    heading: "Fehler",
                    text: "Der angegebene Link ist abgelaufen, bitte überprüfe dein Postfach auf neuere Emails. Wahrscheinlich wurde in der Zwischenzeit bereits erneut um Bestätigung angefragt. Falls der Fehler weiter auftritt, wende dich an die Administratoren.",
                    buttons: [
                        {
                            text: "Zurück zum Dashboard",
                            role: "confirm",
                            action: () => { UrlHandler.setUrl("/app/rents") }
                        }
                    ]
                })
            }
            else{
                PopupEngine.createModal({
                    heading: "Fehler",
                    text: "Der angegebene Link ist ungültig, bitte schließe die Seite und klicke den Link erneut. Falls der Fehler weiter auftritt, wende dich an die Administratoren.",
                    buttons: [
                        {
                            text: "Zurück zum Dashboard",
                            role: "confirm",
                            action: () => {
                                UrlHandler.setUrl("/app/rents")
                            }
                        }
                    ]
                })
            }
        }
    }

    async validateConfirmationCodes(){
        let flaggedRents = []

        for (let i = 0; i < this.rents.length; i++) {
            let valid = await Api.fetchData<boolean>(`/rent/getbyid/${this.rents[i].rent_id}/verifyconfirmationcode/${this.rentConfirmationCodes[i]}`)
            if(!valid) {
                flaggedRents.push(i)
            }
        }

        //remove the rents that dont have matching codes from the list
        //this is done via its own array and using indexof to avoid the array shrinking in size while iterating which would result in missed entries
        flaggedRents.forEach(rent => {
            let index = this.rents.indexOf(rent)
            this.rents.splice(index, 1)
            this.rentConfirmationCodes.splice(index, 1)
        })

        this.requestUpdate()

        return flaggedRents.length > 0
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-external-confirm": ExternalConfirmComponent
    }
}
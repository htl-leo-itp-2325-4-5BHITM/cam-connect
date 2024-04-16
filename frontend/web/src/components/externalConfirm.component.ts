import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/externalConfirm.styles.scss'
import {model} from "../index"
import {ObservedProperty} from "../model"
import {Api, ColorEnum} from "../base"
import {AppState} from "../AppState"
import {icon} from '@fortawesome/fontawesome-svg-core'
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import RentService, {Rent, RentStatusEnum, RentTypeEnum} from "../service/rent.service"
import URLHandler from "../urlHandler"
import PopupEngine from "../popupEngine"

@customElement('cc-external-confirm')
export class ExternalConfirmComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    @property() rents: Rent[] = []
    @property() rentConfirmationCodes: string[] = []

    constructor(studentId: number, ) {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)

        let rentIds = URLHandler.getParam("ids")?.split(",") || []
        if(rentIds && rentIds.length > 0) {
            Api.fetchData<Rent[]>(`/rent/getbyidlist/${rentIds.join(",")}`).then((data) => {
                this.rents = data
                console.log(this.rents)
            })
        }
        else{

        }

        this.rentConfirmationCodes = URLHandler.getParam("codes")?.split(",") || []
        console.log(this.rentConfirmationCodes)

        if(this.rentConfirmationCodes.length != rentIds.length || this.rentConfirmationCodes.length == 0){
            //TODO connect to feedback system
            PopupEngine.createModal({
                heading: "Fehler",
                text: "Der angegebene Link ist ungültig, bitter schließe die Seite und klicke den Link erneut. Falls der Fehler weiter auftritt, wenden sie sich an die Administratoren",
                buttons: [
                    {
                        text: "okay",
                        role: "confirm",
                        action: () => { URLHandler.setUrl("/app/rents"); URLHandler.parseCurrentURL() }
                    }
                ]
            })
        }
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>Hallo ${this.rents[0]?.student.firstname}</h1>
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
                                    <cc-button color="${ColorEnum.GOOD}"
                                               text="Bestätigen"
                                               type="underlined"
                                               @click=${() => RentService.updateStatus(rent.rent_id, this.rentConfirmationCodes[i], RentStatusEnum.CONFIRMED, "")}
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
                                                                   )
                                                               }
                                                           },
                                                           {
                                                               text: "Abbrechen",
                                                               role: "cancel"
                                                           }
                                                       ]
                                                   })
                                               }}"
                                    >
                                        <div slot="right" class="icon bad">
                                            ${unsafeSVG(icon(faXmark).html[0])}
                                        </div>
                                    </cc-button>
                                </li>
                            `
                        })
                    }
                </ul>
                <div class="button-container">
                    <cc-button color="${ColorEnum.GOOD}"
                        text="Alle Bestätigen"
                    type="filled">
                        <div slot="right" class="icon">
                            ${unsafeSVG(icon(faCheck).html[0])}
                        </div>
                    </cc-button>
                </div>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-external-confirm": ExternalConfirmComponent
    }
}
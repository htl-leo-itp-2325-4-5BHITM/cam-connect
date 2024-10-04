import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/rentList.styles.scss'
import {model} from "../../index";
import {RentByStudentDTO, RentStatusEnum, RentTypeEnum} from "../../service/rent.service"
import {ObservedProperty} from "../../model"
import {UserRoleEnum} from "../../service/user.service"
import {AppState} from "../../AppState"
import {ButtonType} from "../basic/button.component"
import UrlHandler from "../../util/UrlHandler"
import {ColorEnum} from "../../base"
import Util from "../../util/Util"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons"
import PopupEngine from "../../util/PopupEngine"

@customElement('cc-rent-list')
export class RentListComponent extends LitElement {
    @property()
    private rents: ObservedProperty<RentByStudentDTO[]>

    @property()
    private appState

    constructor() {
        super()
        this.rents = new ObservedProperty<RentByStudentDTO[]>(this, model.rents)
        this.appState = new ObservedProperty(this, model.appState)
    }
    render() {
        let allRentListsEmpty = this.rents.value.every(student => student.rentList.length <= 0)

        return html`
            <style>${styles}</style>

            ${ model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ? 
                    this.renderRentListForTeacher() : 
                    this.renderRentListForStudent()
        }

            ${this.rents.value.length == 0 || allRentListsEmpty ? html`<p class="noResults">Keine Ergebnisse gefunden</p>` : ""}
        `
    }

    renderRentListForTeacher(){
        return html`
            ${
                this.rents.value.map(rentByStudent => {
                    if(rentByStudent.rentList.every(rent => rent.status == RentStatusEnum.RETURNED)) return
                    else return html`<cc-rent-list-student .rentByStudent="${rentByStudent}"></cc-rent-list-student>`
                })
            }
        `
    }

    renderRentListForStudent(){
        return html`
            <br>
            <ul class="rentsForStudent">
            ${
                this.rents.value[0]?.rentList.map(rent => {
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
            
            <cc-button 
                class="showHistory"
                type="${ButtonType.TEXT}"
                color="${ColorEnum.GRAY}"
                @click="${() => {
                    UrlHandler.updateUrl("/app/rents/details")
                    UrlHandler.setParam("sid", String(this.appState.value.currentUser.user_id))
                    model.appState.value.openOverlay(
                            html`<cc-rent-detail-view .studentId="${this.appState.value.currentUser.user_id}"></cc-rent-detail-view>`,
                            () => { UrlHandler.updateUrl("/app/rents") }
                    )
                }}"
            >
                Verleih-historie anzeigen
            </cc-button>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-list": RentListComponent
    }
}
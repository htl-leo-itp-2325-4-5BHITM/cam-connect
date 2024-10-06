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
                    return html`<cc-rent-list-entry-for-student .rent="${rent}"></cc-rent-list-entry-for-student>`
                })
            }
            </ul>
            
            <cc-button 
                class="showHistory"
                type="${ButtonType.UNDERLINED}"
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
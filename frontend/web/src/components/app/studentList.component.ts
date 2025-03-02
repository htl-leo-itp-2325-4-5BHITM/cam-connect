import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/studentList.styles.scss'
import PopupEngine from "../../util/PopupEngine"
import {ColorEnum, config, SimpleColorEnum, SizeEnum} from "../../base"
import Util from "../../util/Util"
import {ButtonType} from "../basic/button.component"
import {model} from "../../index"
import {Api} from "../../util/Api"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import AuthService from "../../service/auth.service"
import UserService, {Student} from "../../service/user.service"
import UrlHandler from "../../util/UrlHandler"

@customElement('cc-student-list')
export class StudentListComponent extends LitElement {
    @property() private appState: ObservedProperty<AppState>

    @property() private students: ObservedProperty<Student[]>

    private searchTerm = ""

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.students = new ObservedProperty<Student[]>(this, model.students)
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="top">
                <input
                    type="text" 
                    placeholder="Search for Student" 
                    @input="${(e) => { this.searchTerm = e.target.value.toUpperCase(); this.requestUpdate(); }}"
                >
            </div>

            ${
                this.students.value.sort((a, b) => {
                    if(a.firstname < b.firstname)
                        return -1
                    else if(a.firstname > b.firstname)
                        return 1
                    else
                        return 0
                }).filter(s => {
                    const fullName = (s.firstname + " " + s.lastname).toUpperCase();
                    const fullNameReverse = (s.lastname + " " + s.firstname).toUpperCase();
                    const searchTerm = this.searchTerm;
                    return fullName.includes(searchTerm) || fullNameReverse.includes(searchTerm) ||
                            searchTerm.includes(s.firstname.toUpperCase()) &&
                            searchTerm.includes(s.lastname.toUpperCase()) ||
                            s.firstname.toUpperCase().includes(searchTerm) &&
                            s.lastname.toUpperCase().includes(searchTerm);
                }).map(student => {
                    return html`
                        <div class="student">
                            <p>${student.firstname} ${student.lastname}</p>

                            <cc-button type="${ButtonType.OUTLINED}" color="${SimpleColorEnum.GRAY}" size="${SizeEnum.SMALL}"
                                       @click="${() => {
                                           UrlHandler.updateUrl("/app/rents/details")
                                           UrlHandler.setParam("sid", String(student.user_id))
                                           model.appState.value.openOverlay(
                                                   html`<cc-rent-history mode="student" .identifier="${student.user_id}"></cc-rent-history>`,
                                                   () => { UrlHandler.updateUrl("/app/rents") }
                                           )
                                       }}"
                            >Details anzeigen</cc-button>
                        </div>
                    `;
                })
            }
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-student-list": StudentListComponent
    }
}
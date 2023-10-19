import { html, render } from "lit-html"
import { USER_SELECTED_EVENT } from "."
import { User } from "../../model/user"
import userService from "../../user-service"
import store from "../../model/store"
import { distinctUntilChanged, map } from "rxjs"

const rowTemplate = (user: User, onclick: (user: User) => void) => html`
    <tr @click=${() => onclick(user)}>
        <td >${user.id}</td><td>${user.name}</td>
    </tr>
`
export class UserTableComponent extends HTMLElement {
    private _updateComplete = false
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    get updateComplete(): Boolean {
        return this._updateComplete
    }
    connectedCallback() {
        console.log("connected usertable")
        userService.fetchAll()
        store
            .pipe(
                map(model => model.users),
                distinctUntilChanged()
            )
            .subscribe(users => {
                this.render(users)
            })
    }
    render(users: Array<User>) {
        this._updateComplete = false
        const userClicked = (user: User) => {
            alert(`user ${user.name} selected`)
            this.dispatchEvent(new CustomEvent(USER_SELECTED_EVENT, {detail: {user}}))
        }
        const rows = users.map(user => rowTemplate(user, userClicked))
        const tableTemplate = html`
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <table class="w3-table-all">
                <thead>
                    <tr>
                        <th>Id</th><th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `
        render(tableTemplate, this.shadowRoot)
        this._updateComplete = true
    }
}

customElements.define("user-table", UserTableComponent)
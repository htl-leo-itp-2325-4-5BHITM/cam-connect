import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/login.styles.scss'
import {ButtonType} from "./basic/button.component"
import UserService from "../service/user.service"
import {SizeEnum} from "../base"
@customElement('cc-login')
export class LoginComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <h1>cam-connect login</h1>
                <p>Mit IT-User und Password bzw. Lehrer Login</p>
                
                <div class="actions">
                    <input type="text" placeholder="IT999999">
                    <input type="password" placeholder="passwort">
                    <cc-button @click="${this.login}" size="${SizeEnum.BIG}">Einloggen</cc-button>
                </div>
            </main>
        `
    }

    async login() {
        let usernameInput = this.shadowRoot.querySelector("input[type='text']") as HTMLInputElement
        let passwordInput = this.shadowRoot.querySelector("input[type='password']") as HTMLInputElement

        let loginResponse = await UserService.login(usernameInput, passwordInput)

        console.log(loginResponse)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-login": LoginComponent
    }
}
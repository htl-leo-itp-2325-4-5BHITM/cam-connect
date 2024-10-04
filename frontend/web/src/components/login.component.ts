import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/login.styles.scss'
import UserService from "../service/user.service"
import {SizeEnum} from "../base"
import {ButtonType} from "./basic/button.component"
import AuthService, {TokenResponse} from "../service/auth.service"
import {model} from "../index"
import UrlHandler from "../util/UrlHandler"
@customElement('cc-login')
export class LoginComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            <main>
                <div class="content">
                    <h1>login</h1>
                    <p>Mit IT-User und Password bzw. Lehrer Login</p>
                    <input type="text" placeholder="IT000000">
                    
                    <input type="password" placeholder="passwort">
                    
                    <div class="buttons">
                        <cc-button @click="${this.login}" size="${SizeEnum.BIG}">Einloggen</cc-button>
                    </div>
                </div>
            </main>
        `
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.shadowRoot.querySelectorAll("input").forEach((input: HTMLInputElement) => {
            input.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                  this.login()
                }
            })
        })
    }

    async login() {
        let usernameInput = this.shadowRoot.querySelector("input[type='text']") as HTMLInputElement
        let passwordInput = this.shadowRoot.querySelector("input[type='password']") as HTMLInputElement

        let tokenResponse = await AuthService.login(usernameInput.value, passwordInput.value)
        model.appState.value.setAccessToken(tokenResponse.access_token)

        UrlHandler.goToPage("/app/rents")
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-login": LoginComponent
    }
}
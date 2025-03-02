import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/login.styles.scss'
import UserService from "../service/user.service"
import {SizeEnum} from "../base"
import {ButtonType} from "./basic/button.component"
import AuthService, {TokenResponse} from "../service/auth.service"
import {model} from "../index"
import UrlHandler from "../util/UrlHandler"
import PopupEngine from "../util/PopupEngine"
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
                    <p class="error"></p>
                    
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

        let response = await AuthService.login(usernameInput.value, passwordInput.value)

        if(!response) {
            PopupEngine.createNotification({
                heading: "Unbekannter Fehler beim Login",
                text: "Bitte versuche es später erneut.",
                CSSClass: "bad"
            })
            return
        }
        console.log(response)

        switch (response.ccStatus.statusCode) {
            case 1000:
                console.log("keycloak response", response.data)
                model.appState.value.setAccessToken(response.data.access_token)
                model.appState.value.setRefreshToken(response.data.refresh_token, response.data.expires_in)
                UrlHandler.goToPage("/app/rents")
                break
            case 1206:
                this.showError("Benutzername oder Passwort falsch")
                break
            case 1207:
                PopupEngine.createNotification({heading: "Keycloak Fehler beim Login", text: "Die Antwort des Keycloak Servers war kein valdierbares JSON."})
                break
            default:
                PopupEngine.createNotification({heading: "Unbekannter Fehler beim Login", text: "Bitte versuche es später erneut."})
                break
        }
    }

    showError(message: string) {
        this.shadowRoot.querySelector(".error").textContent = message
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-login": LoginComponent
    }
}
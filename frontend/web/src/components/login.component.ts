import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/login.styles.scss'
import UserService from "../service/user.service"
import {SizeEnum} from "../base"
import {ButtonType} from "./basic/button.component"
import AuthService from "../service/auth.service"
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

    async login() {
        let usernameInput = this.shadowRoot.querySelector("input[type='text']") as HTMLInputElement
        let passwordInput = this.shadowRoot.querySelector("input[type='password']") as HTMLInputElement

        let jwt = await AuthService.login(usernameInput.value, passwordInput.value)
        localStorage["cc-jwt"] = jwt
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-login": LoginComponent
    }
}
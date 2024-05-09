import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/userSettings.styles.scss'
import PopupEngine from "../popupEngine"
import {Api, config} from "../base"

@customElement('cc-user-settings')
export class UserSettingsComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>
            
            <main>
                <section>
                    <h1>Account</h1>
                    ${this.getInputField("Name", "text")}
                    ${this.getInputField("Email", "email")}
                    ${this.getInputField("Password", "password")}
                </section>
                
                <section>
                    <h1>Notifications</h1>
                    <cc-toggle>Send emails</cc-toggle>
                    <cc-toggle>Show push notifications</cc-toggle>
                </section>
                
                <section>
                    <h1>Settings</h1>
                    <cc-toggle>Darkmode</cc-toggle>
                    <cc-toggle>New rent as modal or in sidebar</cc-toggle>
                    <cc-toggle>Automatically apply global date selection in creating rent</cc-toggle>
                    <cc-toggle>Remember filters on startup</cc-toggle>
                    <cc-toggle>Select input contents on click</cc-toggle>
                    <cc-toggle>Use global date as default for new device entries</cc-toggle>
                    <cc-toggle>Show hover effect of rentListEntry</cc-toggle>
                </section>
                
                <section>
                    <h1>Keymap</h1>
                    ${this.getInputField("Name", "text")}
                    ${this.getInputField("Name", "text")}
                    ${this.getInputField("Name", "text")}
                </section>
                
                <section>
                    <h1>Data</h1>
                    <a href="${config.api_url}/rent/getcsv" download="file.csv">
                        <cc-button>Export all rents</cc-button>
                    </a>
                    
                    <div class="inputField">
                        <label for="importRents">Import rents:</label>
                        <input id="importRents" type="file" @change="${(event) => {this.importDataFromCsv(event)}}" accept=".csv"/>
                    </div>
                </section>
            </main>
        `
    }

    getInputField(label: string, type: string){
        return html`<div class="inputField">
                        <label for="${label}+Id">${label}:</label>
                        <input type="${type}" id="${label}+Id">
                    </div>`
    }

    importDataFromCsv(event: Event) {
        let input = event.target as HTMLInputElement
        let file:File = input.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        Api.postData(`/rent/import`, formData, "upload")
            .then((data) => {
                switch (data.ccStatus.statusCode){
                    case 1000:
                        PopupEngine.createNotification({text: `Successfully imported rents`, CSSClass: "good"})
                        break
                    case 1201:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil der DeviceType bereits existiert`, CSSClass: "bad"})
                        break
                    case 1203:
                        PopupEngine.createNotification({text: `Konnte nicht importiert werden, weil das File leer ist`, CSSClass: "bad"})
                        break
                    case 1204:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil die filestruktur invalide ist`, CSSClass: "bad"})
                        break
                }})
            .catch(error => {
                console.error(error)
            })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-user-settings": UserSettingsComponent
    }
}
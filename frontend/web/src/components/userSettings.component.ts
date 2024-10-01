import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/userSettings.styles.scss'
import PopupEngine from "../util/PopupEngine"
import {config, SimpleColorEnum, SizeEnum} from "../base"
import Util from "../util/Util"
import {ButtonType} from "./basic/button.component"
import {model} from "../index"
import {Api} from "../util/Api"
import {ObservedProperty} from "../model"
import {AppState} from "../AppState"
import AuthService from "../service/auth.service"

@customElement('cc-user-settings')
export class UserSettingsComponent extends LitElement {
    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="back"></cc-navbar>
            
            <main>
                <h1>Hallo ${this.appState.value.currentUser?.firstname}</h1>
                
                <cc-button @click="${AuthService.logOut}">Ausloggen</cc-button>
                
                <section>
                    <h1>Notifications</h1>
                    <cc-toggle>Send emails</cc-toggle>
                    <cc-toggle>Show push notifications</cc-toggle>
                </section>
                
                <section>
                    <h1>Settings</h1>
                    <div class="line">
                        <p>Darstellung</p>
                        <cc-select size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.GRAY}" heavy .onSelect="${option=>this.updateSetting("isDarkmode", option, prop => prop=='dark')}">
                            <p class="${model.appState.value.userSettings.isDarkmode ? '' : 'selected'}" data-prop="light">Hell</p>
                            <p class="${model.appState.value.userSettings.isDarkmode ? 'selected' : ''}" data-prop="dark">Dunkel</p>
                        </cc-select>
                    </div>
                    <div class="line">
                        <p>"Verleih-erstellen" Menü</p>
                        <cc-select size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.GRAY}" heavy>
                            <p>Sidebar</p>
                            <p>Modal</p>
                        </cc-select>
                    </div>
                    <cc-toggle>Globales Datum für neue Verleiheinträge verwenden</cc-toggle>
                    <cc-toggle>Rent Filter nach Schließen der Seite merken</cc-toggle>
                    <cc-toggle>Eingabefeld Inhalte beim klick markieren</cc-toggle>
                    <cc-toggle>Hover-Effekt der Verleiheinträge anzeigen</cc-toggle>
                </section>
                
                <section>
                    <h1>Keymap</h1>
                    ${this.generateInputField("Name", "text")}
                    ${this.generateInputField("Name", "text")}
                    ${this.generateInputField("Name", "text")}
                </section>
                
                <section>
                    <h1>Data</h1>
                    <div class="line">
                        <p>Alle Verleiheinträge exportieren</p>
                        <a href="${config.api_url}/rent/getcsv" download>
                            <cc-button type="${ButtonType.OUTLINED}">Exportieren</cc-button>
                        </a>
                        
                        <a href="${config.api_url}/devicetype/getcsv" download>
                            alle gerätetypen exportieren
                        </a>
                    </div>
                    
                    <div class="inputField">
                        <label for="importRents">Import rents:</label>
                        <input id="importRents" type="file" @change="${(event) => {this.importDataFromCsv(event)}}" accept=".csv"/>
                    </div>
                </section>
            </main>
        `
    }

    updateSetting(name:string, elem:HTMLElement, getValue: (prop) => any){
        let prop = elem.getAttribute("data-prop")
        let newSettings = model.appState.value.userSettings
        newSettings[name] = getValue(prop)
        model.appState.value.userSettings = newSettings
    }

    generateInputField(label: string, type: string){
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
                console.log(data)
                switch (data.ccStatus.statusCode){
                    case 1000:
                        PopupEngine.createNotification({text: `Verleiheinträge wurden importiert`, CSSClass: "good"})
                        break
                    case 1201:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil der Rent bereits existiert`, CSSClass: "bad"})
                        break
                    case 1203:
                        PopupEngine.createNotification({text: `Konnte nicht importiert werden, weil das File leer ist`, CSSClass: "bad"})
                        break
                    case 1204:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil die Filestruktur invalide ist`, CSSClass: "bad"})
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
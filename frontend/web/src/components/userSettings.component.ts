import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/edit.styles.scss'
import PopupEngine from "../popupEngine"
import {Api} from "../base"
@customElement('cc-user-settings')
export class UserSettingsComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>

            <div>
                <cc-button @click="${this.exportRent}">Export all rents</cc-button>
                <input type="file"
                       @change="${(event) => {
                           this.importDataFromCsv(event, "device", "")
                       }}"
                       accept=".csv"
                />
            </div>
        `
    }

    exportRent(){
        
    }

    importDataFromCsv(event: Event, importType: string, type:string) {
        let input = event.target as HTMLInputElement
        let file:File = input.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        Api.postData(`/${importType}/import/${type}`, formData, "upload")
            .then((data) => {
                switch (data.ccStatus.statusCode){
                    case 1000:
                        PopupEngine.createNotification({text: `Successfully imported ${type}`, CSSClass: "good"})
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
import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/edit.styles.scss'
import {Api, ccResponse, config} from "../base"
import PopupEngine from "../popupEngine"
@customElement('cc-edit')
export class EditComponent extends LitElement {
    render() {
        let listOfString = ["camera", "drone", "lens", "light", "microphone", "simple", "stabilizer", "tripod"];

        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>

            <div>
                <h2>Device Type Import</h2>
                <select id="listOfTypes" @change="${(event) => this.selectOption(event.target.value)}">
                    ${listOfString.map(type => html`<option value="${type}">${type}</option>`)}
                </select>
                <div class="importBox">
                    <input type="file"
                           @change="${(event) => {
                               this.importDataFromCsv(event, "devicetype", listOfString[0])
                           }}" 
                           accept=".csv"
                    />
                </div>
            </div>

            <div>
                <h2>Device Import</h2>
                <input type="file"
                       @change="${(event) => {
                           this.importDataFromCsv(event, "device", "")
                       }}" 
                       accept=".csv"
                />
            </div>
        `
    }

    selectOption(type) {
        //TODO why is this code structured like this
        //you completely remove and re add the input instead of simply changing the type
        //either change this to a class variable that or use a data-type property on the input
        //both can be easily referenced in the @click binding on the input

        const importBox = this.shadowRoot.querySelector('.importBox')
        importBox.innerHTML = ''

        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.csv'
        input.addEventListener('change', (event) => {
            this.importDataFromCsv(event, "devicetype", type)
        })
        importBox.appendChild(input)
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
        "cc-edit": EditComponent
    }
}
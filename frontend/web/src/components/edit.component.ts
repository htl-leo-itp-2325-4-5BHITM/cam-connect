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
                <select name="listOfTypes" id="listOfTypes" @change="${(event) => this.selectOption(event.target.value)}">
                    ${listOfString.map(type => html`<option value="${type}">${type}</option>`)}
                </select>
                <div class="importBox">
                    <input type="file"
                           @change="${(event) => {
                               this.importDataFromCsv(event, "devicetype", listOfString[0])
                           }}" accept=".csv"/>
                </div>
            </div>

            <div>
                <h2>Device Import</h2>
                <input type="file"
                       @change="${(event) => {
                           this.importDataFromCsv(event, "device", "")
                       }}" accept=".csv"/>
            </div>
        `;
    }
    selectOption(type) {
        const importBox = this.shadowRoot.querySelector('.importBox');
        importBox.innerHTML = '';
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.addEventListener('change', (event) => {
            this.importDataFromCsv(event, "devicetype", type)
        });
        importBox.appendChild(input);
    }

    importDataFromCsv(event: Event, importType: string, type:string, ) {
        let input = event.target as HTMLInputElement
        let file:File = input.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        Api.postData(`/${importType}/import/${type}`, formData, "upload")
            .then((data) => {
                console.log(data)
                switch (data.ccStatus.statusCode){
                    case 1000:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Successfully imported ${type}`})
                        break
                    case 1201:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil der DeviceType bereits existiert`})
                        break
                    case 1203:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Konnte nicht importiert werden, weil das File leer ist`})
                        break
                    case 1204:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil die filestruktur invalide ist`})
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
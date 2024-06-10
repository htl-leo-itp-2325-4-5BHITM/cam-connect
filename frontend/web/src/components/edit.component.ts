import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import styles from '../../styles/components/edit.styles.scss';
import {Api, ccResponse, config} from "../base";
import PopupEngine from "../popupEngine";
import {ButtonType} from "./basic/button.component";

@customElement('cc-edit')
export class EditComponent extends LitElement {
    @state() currentOption = "camera";

    render() {
        let listOfString = ["camera", "drone", "lens", "light", "microphone", "simple", "stabilizer", "tripod"];

        return html`
            <style>${styles}</style>
            <cc-navbar type="back"></cc-navbar>

            <main>
                <div class="importBox">
                    <h1>Importieren</h1>
                    <div class="line">
                        <input type="file"
                               @change="${(event) => {this.importDataFromCsv(event, "devicetype", "all")}}"
                               accept=".csv"
                        />
                    </div>
                    <div class="line">
                        <input type="file"
                               data-devicetype="camera"
                               @change="${(event) => {this.importDataFromCsv(event, "devicetype", "true")}}"
                               accept=".csv"
                        />
                        <select id="listOfTypes" @change="${(event) => this.selectOption(event.target.value, '#listOfTypes')}">
                            ${listOfString.map(type => html`<option value="${type}">${type}</option>`)}
                        </select>
                    </div>
                    <div class="line">
                        <input type="file"
                               @change="${(event) => {this.importDataFromCsv(event, "device", "")}}"
                               accept=".csv"
                        />
                    </div>
                </div>

                <div>
                    <h1>Exportieren</h1>
                    
                    <div class="line">
                        <a href="${config.api_url}/devicetype/getcsv"    download>
                            <cc-button type="${ButtonType.OUTLINED}">All Device Types</cc-button>
                        </a>                    
                    </div>

                    <div class="line">
                        <a href="${config.api_url}/devicetype/getcsv/${this.currentOption}" download>
                            <cc-button type="${ButtonType.OUTLINED}">Device Types</cc-button>
                        </a>
                        <select id="listOfTypes2" @change="${(event) => this.selectOption(event.target.value, '#listOfTypes2')}">
                            ${listOfString.map(type => html`<option value="${type}">${type}</option>`)}
                        </select>
                    </div>

                    <div class="line">
                        <a href="${config.api_url}/device/getcsv" download>
                            <cc-button type="${ButtonType.OUTLINED}">Devices</cc-button>
                        </a>
                    </div>
                </div>
            </main>
        `;
    }

    selectOption(type, selectId) {
        (this.shadowRoot.querySelector(selectId) as HTMLInputElement).dataset.devicetype = type;

        if (selectId == "#listOfTypes2") {
            this.currentOption = type;
        }
    }

    importDataFromCsv(event: Event, importType: string, deviceType: string) {
        let type = deviceType
        if(deviceType == "true"){
            type = (this.shadowRoot.querySelector("#listOfTypes") as HTMLInputElement).dataset.devicetype || "camera";
        }

        let input = event.target as HTMLInputElement;
        let file: File = input.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);

        Api.postData(`/${importType}/import/${type}`, formData, "upload")
            .then((data) => {
                console.log(data)
                switch (data.ccStatus.statusCode) {
                    case 1000:
                        PopupEngine.createNotification({text: `Successfully imported ${type}`, CSSClass: "good"});
                        break;
                    case 1201:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil der Device bereits existiert`, CSSClass: "bad"});
                        break;
                    case 1203:
                        PopupEngine.createNotification({text: `Konnte nicht importiert werden, weil das File leer ist`, CSSClass: "bad"});
                        break;
                    case 1204:
                        PopupEngine.createNotification({text: `Konnte nicht importieren, weil die filestruktur invalide ist`, CSSClass: "bad"});
                        break;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit": EditComponent;
    }
}

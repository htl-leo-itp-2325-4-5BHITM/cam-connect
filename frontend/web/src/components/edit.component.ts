import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import styles from '../../styles/components/edit.styles.scss';
import {Api, SizeEnum} from "../base";
import PopupEngine from "../popupEngine";
import {ObservedProperty} from "../model"
import {AppState} from "../AppState"
import {DeviceTypeFullDTO, DeviceTypeVariantEnum} from "../service/deviceType.service"
import {model} from "../index"

@customElement('cc-edit')
export class EditComponent extends LitElement {
    @state() currentOption: string | number = "camera"

    @property() private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>

    @property() private appState: ObservedProperty<AppState>

    constructor() {
        super()
        this.deviceTypesFull = new ObservedProperty<DeviceTypeFullDTO[]>(this, model.deviceTypesFull)
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="back"></cc-navbar>
            
            <cc-sidebar accountname="Martin Huemer" type="edit">
            </cc-sidebar>

            <div class="toolbar-container">
                <cc-toolbar></cc-toolbar>
                
                <main>
                    <h1>Kamera-Gerätetypen</h1>

                    ${Object.values(this.deviceTypesFull.value)?.flat().map(deviceType => {
                        if(deviceType.deviceType.variant == this.currentOption){
                            return html`<cc-device-type-edit-entry .deviceType="${deviceType}"></cc-device-type-edit-entry>`
                        }
                    })}
                </main>
            </div>
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

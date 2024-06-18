import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import PopupEngine from "../../../util/PopupEngine";
import {EditPageEnum, ObservedProperty} from "../../../model"
import {AppState} from "../../../AppState"
import {DeviceTypeFullDTO} from "../../../service/deviceType.service"
import {model} from "../../../index"
import styles from '../../../../styles/components/app/edit/edit.styles.scss'
import UrlHandler from "../../../util/UrlHandler"
import {Api} from "../../../util/Api"

@customElement('cc-edit')
export class EditComponent extends LitElement {
    @property() private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>


    constructor(){
        super()
        this.deviceTypesFull = new ObservedProperty<DeviceTypeFullDTO[]>(this, model.deviceTypesFull)
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="back"></cc-navbar>

            <cc-sidebar accountname="Martin Huemer" type="edit"></cc-sidebar>

            ${this.getComponent()}
        `
    }

    getComponent(){
        if(model.appState.value.editPage == EditPageEnum.OVERVIEW){
            return html`<cc-device-type-edit></cc-device-type-edit>`
        }

        if(model.appState.value.editPage == EditPageEnum.CHILDREN){
            return html`${this.deviceTypesFull.value.map(elem => {
                //@ts-ignore
                if(elem.deviceType.type_id == UrlHandler.getParam("gid")){
                    console.log(elem)
                    return html`<cc-device-type-children .deviceType="${elem}"></cc-device-type-children>`
                }
            })}`
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

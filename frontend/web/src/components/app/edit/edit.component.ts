import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import PopupEngine from "../../../util/PopupEngine";
import {EditPageEnum, ObservedProperty} from "../../../model"
import {DeviceTypeFullDTO, DeviceTypeVariantEnum} from "../../../service/deviceType.service"
import {model} from "../../../index"
import styles from '../../../../styles/components/app/edit/edit.styles.scss'
import UrlHandler from "../../../util/UrlHandler"
import {Api} from "../../../util/Api"
import {AppState} from "../../../AppState"
import {Device} from "../../../service/device.service"

@customElement('cc-edit')
export class EditComponent extends LitElement {
    @property() private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>

    @property() private appState: ObservedProperty<AppState>

    constructor(){
        super()
        this.deviceTypesFull = new ObservedProperty<DeviceTypeFullDTO[]>(this, model.deviceTypesFull)
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.appState.value.editComponentElement = this
    }

    render() {
        return html`
            <style>${styles}</style>
            <cc-navbar type="back"></cc-navbar>

            <cc-sidebar accountname="Martin Huemer" type="edit"></cc-sidebar>

            <div class="editModal" hidden="hidden">
                ${this.getModalContent(EditPageEnum.DEVICETYPE)}
            </div>

            ${this.getComponent()}
        `
    }

    getComponent(){
        if(model.appState.value.editPage == EditPageEnum.OVERVIEW){
            return html`<cc-device-type-edit></cc-device-type-edit>`
        }

        if(model.appState.value.editPage == EditPageEnum.CHILDREN){
            return html`${this.deviceTypesFull.value.map(elem => {
                if(elem.deviceType.type_id == parseInt(UrlHandler.getParam("gid"))){
                    return html`<cc-device-type-children .deviceType="${elem}"></cc-device-type-children>`
                }
            })}`

            /*let type = this.deviceTypesFull.value.filter(type=> type.deviceType.type_id == parseInt(UrlHandler.getParam("gid")))

            return html`<cc-device-type-children .deviceType="${type}"></cc-device-type-children>`*/
        }
    }

    showModal(element: Device | DeviceTypeFullDTO, type: "create" | "update", editPageType : EditPageEnum){
        this.shadowRoot.querySelector(".editModal").setAttribute("hidden", "false")

        console.log(this.getModalContent)
        //this.shadowRoot.querySelector(".editModal").innerHTML = `${this.getModalContent(editPageType)}`
    }

    getModalContent(editPageType: EditPageEnum){
        if(editPageType == EditPageEnum.DEVICETYPE){
            return html`
                <h1>Gerätetyp Erstellen</h1>
                <input placeholder="Name">
                <input placeholder="Bild">
                <input type="file">
                
                <div>
                    <cc-line></cc-line>
                    <cc-dropdown>Kamera</cc-dropdown>
                    <cc-line></cc-line>
                </div>
                
                <input placeholder="Maximale Bildrate (FPS)">
                <input placeholder="Anderer Text">
            `
        }

        if(editPageType == EditPageEnum.DEVICE){
            return html`
                <h1>Gerät Erstellen</h1>
                <cc-dropdown placeholder="Gerätetyp"></cc-dropdown>
                <input placeholder="Gerätenummer">
                <input placeholder="Seriennummer">
                <cc-line></cc-line>
                
                <cc-toggle>Gerät ist aktiv</cc-toggle>
                <textarea placeholder="Notiz" rows="2"></textarea>
            `
        }
    }

    getModalContentByDeviceType(deviceType : DeviceTypeVariantEnum){
        switch(deviceType){
            case DeviceTypeVariantEnum.camera: return html`
                
            `
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

import {html, LitElement, PropertyValues, render} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import PopupEngine from "../../../util/PopupEngine";
import {EditPageEnum, ObservedProperty} from "../../../model"
import {DeviceTypeFullDTO, DeviceTypeVariantEnum} from "../../../service/deviceType.service"
import {model} from "../../../index"
import styles from '../../../../styles/components/app/edit/edit.styles.scss'
import UrlHandler from "../../../util/UrlHandler"
import {AppState} from "../../../AppState"
import {Api} from "../../../util/Api"
import {Device} from "../../../service/device.service"
import {InputType} from "../../basic/input.component"
import {ButtonType} from "../../basic/button.component"
import {ColorEnum, SimpleColorEnum, SizeEnum} from "../../../base"
import {ChipType} from "../../basic/chip.component"
import TagService, {Tag} from "../../../service/tag.service"

@customElement('cc-edit')
export class EditComponent extends LitElement {
    @property() private deviceTypesFull: ObservedProperty<DeviceTypeFullDTO[]>

    @property() private appState: ObservedProperty<AppState>

    currentEditType : DeviceTypeVariantEnum = DeviceTypeVariantEnum.camera

    tags: Tag[] = []

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
                <div class="content">
                    ${this.getModalContent(this.appState.value.editPage)}
                </div>
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

        render(
            this.getModalContent(editPageType),
            this.shadowRoot.querySelector(".editModal .content") as HTMLElement
        )
    }

    closeModal(){
        this.shadowRoot.querySelector(".editModal").setAttribute("hidden", "hidden")
    }

    getModalContent(editPageType: EditPageEnum){
        if(editPageType == EditPageEnum.DEVICETYPE){
            return html`
                <h1>Gerätetyp Erstellen</h1>
                <cc-input placeholder="Name"></cc-input>
                <cc-input placeholder="Bild" type="${InputType.UPLOAD}"></cc-input>
                
                <div class="separator">
                    <cc-line></cc-line>
                    <cc-dropdown
                            .options="${model.deviceTypeNameFilterOptions.value.map(option => ({ id: option.id, data: option.name }))}"
                            .onSelect="${(option) => {
                                this.currentEditType = option.id
                                this.shadowRoot.querySelector(".contentByDeviceType").innerHTML = ""
                                render(
                                    this.getModalContentByDeviceType(),
                                    this.shadowRoot.querySelector(".contentByDeviceType") as HTMLElement
                                )
                            }}"
                    ></cc-dropdown>
                    <cc-line></cc-line>
                </div>
                
                <div class="contentByDeviceType">
                    ${this.getModalContentByDeviceType()}
                </div>

                <div class="separator">
                    <cc-line></cc-line>
                </div>               
                
                <div class="tags">
                    <cc-autocomplete placeholder="Tags" class="tagSelector" color="${ColorEnum.GRAY}" size="${SizeEnum.MEDIUM}"
                                     .selected="${{id: this.tags[0]?.tag_id, data: this.tags[0]?.name}}"
                                     .onSelect="${(option: Tag) => {
                                         this.tags.push(option)
                                     }}"
                                     .querySuggestions="${TagService.search}"
                                     .contentProvider="${(data: Tag) => {return `${data.name} • ${data.types}`}}"
                    ></cc-autocomplete>
                    
                    <div>
                        <cc-chip text="Makro" color="${ColorEnum.GRAY}" type="${ChipType.REMOVABLE}"></cc-chip>
                        <cc-chip text="Slow Motion" color="${ColorEnum.GRAY}" type="${ChipType.REMOVABLE}"></cc-chip>
                    </div>
                </div>
                
                <div class="navigation">
                    <cc-button color="${ColorEnum.GRAY}" @click="${() => {this.closeModal()}}">Abbrechen</cc-button>
                    <cc-button>Erstellen</cc-button>
                </div>
            `
        }

        if(editPageType == EditPageEnum.DEVICE){
            return html`
                <h1>Gerät Erstellen</h1>
                                    <cc-autocomplete placeholder="Tags" class="tagSelector" color="${ColorEnum.GRAY}" size="${SizeEnum.MEDIUM}"
                                     .selected="${{id: this.tags[0]?.tag_id, data: this.tags[0]?.name}}"
                                     .onSelect="${(option: Tag) => {
                this.tags.push(option)
            }}"
                                     .querySuggestions="${TagService.search}"
                                     .contentProvider="${(data: Tag) => {return `${data.name} • ${data.types}`}}"
                    ></cc-autocomplete>
                <cc-input placeholder="Gerätenummer"></cc-input>
                <cc-input placeholder="Seriennummer"></cc-input>

                
                <div class="separator">
                    <cc-line></cc-line>
                </div>

                <div class="tags">
                    <cc-toggle>Gerät ist aktiv</cc-toggle>
                    <cc-input placeholder="Notiz" type="${InputType.TEXTAREA}"></cc-input>
                </div>

                <div class="navigation">
                    <cc-button color="${ColorEnum.GRAY}" @click="${() => {this.closeModal()}}">Abbrechen</cc-button>
                    <cc-button>Erstellen</cc-button>
                </div>
            `
        }
    }

    getModalContentByDeviceType(){
        switch(this.currentEditType){
            case DeviceTypeVariantEnum.camera:
                console.log("camera")
                return html`
                <div>
                    <p>Sensor</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraSensors.map(option => ({ id: option.attribute_id, data: option.name }))}"
                    ></cc-dropdown>
                </div>

                <div>
                    <p>Resolution</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraResolutions.map(option => ({ id: option.attribute_id, data: option.name }))}"
                    ></cc-dropdown>
                </div>
                
                <div>
                    <p>Mount</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.lensMounts.map(option => ({ id: option.attribute_id, data: option.name }))}"
                    ></cc-dropdown>
                </div>
                
                <div>
                    <p>System</p>
                    <cc-dropdown
                            .options="${model.deviceTypeAttributes.value.cameraSystems.map(option => ({ id: option.attribute_id, data: option.name }))}"
                    ></cc-dropdown>
                </div>
                
                <cc-toggle>Autofokus</cc-toggle>
                <cc-input placeholder="Maximale Bildrate (FPS)"></cc-input>
            `
            case DeviceTypeVariantEnum.drone:
                console.log("drone")
                return html`
                    <div>
                        <p>System</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.cameraSystems.map(option => ({ id: option.attribute_id, data: option.name }))}"
                        ></cc-dropdown>
                    </div>

                    <div>
                        <p>Resolution</p>
                        <cc-dropdown
                                .options="${model.deviceTypeAttributes.value.cameraResolutions.map(option => ({ id: option.attribute_id, data: option.name }))}"
                        ></cc-dropdown>
                    </div>
                
                <cc-input placeholder="Maximale Reichweite"></cc-input>
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

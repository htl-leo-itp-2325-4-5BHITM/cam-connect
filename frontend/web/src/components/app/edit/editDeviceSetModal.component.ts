import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditPageEnum, ObservedProperty} from "../../../model";
import DeviceTypeService, {
    AudioType,
    CameraType,
    DeviceType,
    DeviceTypeFullDTO, DeviceTypeSource,
    DeviceTypeVariantEnum,
    DroneType,
    LensType,
    LightType,
    MicrophoneType,
    SimpleType,
    StabilizerType,
    TripodType
} from "../../../service/deviceType.service";
import {model} from "../../../index";
import styles from '../../../../styles/components/app/edit/editModal.styles.scss';
import {AppState} from "../../../AppState";
import TagService, {Tag} from "../../../service/tag.service";
import {InputType} from "../../basic/input.component";
import {ColorEnum, SizeEnum} from "../../../base";
import {ChipType} from "../../basic/chip.component";
import DeviceService, {Device, DeviceStatus} from "../../../service/device.service";
import {unsafeSVG} from "lit/directives/unsafe-svg.js";
import {icon} from "@fortawesome/fontawesome-svg-core";
import {faTag} from "@fortawesome/free-solid-svg-icons";
import PopupEngine from "../../../util/PopupEngine"
import UrlHandler from "../../../util/UrlHandler"
import DeviceSetService, {DeviceSetCreateDTO, DeviceSet} from "../../../service/deviceSet.service"

@customElement('cc-edit-device-set-modal')
export class EditDeviceSetModalComponent extends LitElement {
    @property() private element: DeviceSetCreateDTO | null;
    @property() private appState: ObservedProperty<AppState>;
    @property() private isEditMode: boolean = true;
    private deviceTypes: DeviceType[] = [];

    startElement: DeviceSetCreateDTO | null = null;
    tags: Tag[] = [];

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState);
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.isEditMode) {
            this.element = {
                id: -1,
                name: "",
                description: "",
                deviceTypeIds: [],
                status: DeviceStatus.ACTIVE
            } as DeviceSetCreateDTO;

            this.startElement = this.element;
        }

        if (this.element) {
            Promise.all(this.element.deviceTypeIds.map(id => DeviceTypeService.getDeviceTypeById(id)))
                .then(deviceTypes => {
                    this.deviceTypes = deviceTypes;
                    this.requestUpdate();
                })
                .catch(error => {
                    console.error("Error fetching device types:", error);
                });
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        return html`
            <style>${styles}</style>
            ${this.getModalContent()}
            <div class="navigation">
                <cc-button color="${ColorEnum.GRAY}" @click="${() => {
                    model.appState.value.closeOverlay()
                }}">Schließen
                </cc-button>
                ${!this.isEditMode ? html`
                    <cc-button .disabled="" @click="${() => {
                        this.createElement(this.element)
                    }}">Erstellen
                    </cc-button>` : ``}
            </div>
        `;
    }

    createElement(element: DeviceSetCreateDTO) {
        DeviceSetService.create(element)
            .then(() => {
                model.appState.value.closeOverlay();
            })
            .catch(error => {
                PopupEngine.createNotification({
                    text: "Something went wrong while creating the device set: " + error,
                    CSSClass: "bad"
                })
            });
    }

    private updateDeviceSet(element: DeviceSetCreateDTO) {
        this.requestUpdate()
        if (this.isEditMode){
            DeviceSetService.update(element);
        }
    }

    getModalContent() {
        console.log(this.element)
            return html`
                <h1>Gerät-Set Erstellen</h1>
                <div class="contentByDeviceType">
                    <cc-input label="Name" text="${this.element.name}" .onInput="${text => {
                        this.element.name = text;
                        this.updateDeviceSet(this.element);
                    }}"></cc-input>
                    <cc-input label="Beschreibung" text="${this.element.description}" type="${InputType.TEXTAREA}"
                                      .onInput="${text => {
                        this.element.description = text;
                        this.updateDeviceSet(this.element);
                    }}" maxLength="30"></cc-input>
                </div>
                <div class="separator">
                    <cc-line></cc-line>
                </div>
                <cc-toggle .toggled="${this.element.status == DeviceStatus.ACTIVE}" .onToggle="${(option => {
                    this.element.status = option ? DeviceStatus.ACTIVE : DeviceStatus.UNAVAILABLE;
                    this.updateDeviceSet(this.element);
                })}">Gerät ist aktiv
                </cc-toggle>
                
                <div class="separator">
                    <cc-line></cc-line>
                </div>

                <div class="deviceTypes">
                    <cc-autocomplete placeholder="Name" class="name"
                                     .onSelect="${(option: DeviceTypeSource) => {
                                         if(option == null) return;
                                         
                                         if(this.element.deviceTypeIds.includes(option.type_id)) return;
                                        DeviceTypeService.getDeviceTypeById(option.type_id).then(deviceType => {
                                            this.deviceTypes.push(deviceType);
                                            this.requestUpdate();
                                        });
                                        this.element.deviceTypeIds.push(option.type_id);
                                        this.updateDeviceSet(this.element);
                                     }}"
                                     .querySuggestions="${DeviceTypeService.search}"
                                     .iconProvider="${data => {DeviceTypeService.deviceTypeToIcon(data.variant)}}"
                                     .contentProvider="${(data: DeviceTypeSource) => {return data.name}}"
                                     allowNoSelection="true"
                    ></cc-autocomplete>

                    <div class="entries">
                        <div class="entry">
                            <p>${this.deviceTypes.map(deviceType => html`${deviceType.name}`)}</p>

                        </div>
                    </div>
                </div>
            `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit-device-set-modal": EditDeviceSetModalComponent;
    }
}
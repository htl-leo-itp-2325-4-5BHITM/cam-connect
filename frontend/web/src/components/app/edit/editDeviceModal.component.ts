import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditPageEnum, ObservedProperty} from "../../../model";
import DeviceTypeService, {
    AudioType,
    CameraType,
    DeviceType,
    DeviceTypeFullDTO,
    DeviceTypeVariantEnum,
    DroneType,
    LensType,
    LightType,
    MicrophoneType,
    SimpleType,
    StabilizerType,
    Tag,
    TripodType
} from "../../../service/deviceType.service";
import {model} from "../../../index";
import styles from '../../../../styles/components/app/edit/editModal.styles.scss';
import {AppState} from "../../../AppState";
import TagService from "../../../service/tag.service";
import {InputType} from "../../basic/input.component";
import {ColorEnum, SizeEnum} from "../../../base";
import {ChipType} from "../../basic/chip.component";
import DeviceService, {Device, DeviceStatus} from "../../../service/device.service";
import {unsafeSVG} from "lit/directives/unsafe-svg.js";
import {icon} from "@fortawesome/fontawesome-svg-core";
import {faTag} from "@fortawesome/free-solid-svg-icons";
import PopupEngine from "../../../util/PopupEngine"

@customElement('cc-edit-device-modal')
export class EditDeviceModalComponent extends LitElement {
    @property() private element: Device | null;
    @property() private appState: ObservedProperty<AppState>;
    @property() private isEditMode: boolean = true;

    @property() private deviceType: DeviceTypeFullDTO

    currentEditType: DeviceTypeVariantEnum = DeviceTypeVariantEnum.camera;
    tags: Tag[] = [];

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState);

        console.log(this.isEditMode)
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.isEditMode) {
            console.log("new")
            this.element = {
                device_id: 0,
                serial: "",
                number: "",
                note: "",
                type: this.deviceType.deviceType,
                creation_date: "",
                change_date: "",
                status: DeviceStatus.ACTIVE
            } as Device;
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
                }}">Abbrechen
                </cc-button>
                ${!this.isEditMode ? html`
                    <cc-button .disabled="${this.element.serial.length < 2 || this.element.number.length < 2}" @click="${() => {
                        this.createElement(this.element)
                    }}">Erstellen
                    </cc-button>` : ''}
            </div>
        `;
    }

    createElement(element: Device | DeviceTypeFullDTO) {
        DeviceService.create(element as Device)
            .then(() => {
                model.appState.value.closeOverlay();
            })
            .catch(error => {
                PopupEngine.createNotification({
                    text: "Something went wrong while creating device type: " + error,
                    CSSClass: "bad"
                })
            });
    }

    private updateDevice(element: Device) {
        console.log(element)
        this.requestUpdate()
        if (this.isEditMode) DeviceService.update(element);
    }

    getModalContent() {
            console.log(this.element)

            return html`
                <h1>Gerät Erstellen</h1>
                <div class="contentByDeviceType">
                    <div>
                        <p>Gerätetyp</p>
                        <p>${this.element.type.name}</p>
                    </div>
                    <cc-input label="Gerätenummer" text="${this.element.number}" .onInput="${text => {
                        this.element.number = text;
                        this.updateDevice(this.element);
                    }}"></cc-input>
                    <cc-input label="Seriennummer" text="${this.element.serial}" type="${InputType.NUMBER}"
                              .onInput="${text => {
                                  this.element.serial = text;
                                  this.updateDevice(this.element);
                              }}"></cc-input>
                </div>
                <div class="separator">
                    <cc-line></cc-line>
                </div>
                <cc-toggle .toggled="${this.element.status == DeviceStatus.ACTIVE}" .onToggle="${(option => {
                    this.element.status = option ? DeviceStatus.ACTIVE : DeviceStatus.UNAVAILABLE;
                    this.updateDevice(this.element);
                })}">Gerät ist aktiv
                </cc-toggle>
                <cc-input label="Notiz" text="${this.element.note}" type="${InputType.TEXTAREA}" .onInput="${text => {
                    this.element.note = text;
                    this.updateDevice(this.element);
                }}"></cc-input>
            `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit-device-modal": EditDeviceModalComponent;
    }
}
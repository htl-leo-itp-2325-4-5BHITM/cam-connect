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
import {ButtonType} from "../../basic/button.component"

@customElement('cc-edit-device-type-modal')
export class EditDeviceTypeModalComponent extends LitElement {
    @property() private element: DeviceTypeFullDTO | null;
    @property() private appState: ObservedProperty<AppState>;
    @property() private isEditMode: boolean = true;

    currentEditType: DeviceTypeVariantEnum = DeviceTypeVariantEnum.camera;
    tags: Tag[] = [];

    @property() isFinishable: boolean = false

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState);
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        if (this.element == null) {
            return html`
                <style>${styles}</style>
                <h1>Gerätetyp Erstellen</h1>
                <div class="selectType">
                    ${model.deviceTypeNameFilterOptions.value.map(option => {
                        return html`
                            <div @click="${() => {
                                this.setType(DeviceTypeVariantEnum[option.id])
                            }}">
                                ${DeviceTypeService.deviceTypeToIcon(DeviceTypeVariantEnum[option.id])}
                                ${option.name}
                            </div>`;
                    })}
                </div>
            `;
        }


        if (this.isEditMode) {
            return html`
                <style>${styles}</style>
                ${this.getModalContent()}
                <div class="navigation">
                    <cc-button color="${ColorEnum.GRAY}" type="${ButtonType.UNDERLINED}" @click="${() => {
                        UrlHandler.setUrl('/app/edit/children?gid=' + this.element.deviceType.type_id)
                    }}">
                        Zugehörige Geräte
                    </cc-button>
                    <cc-button @click="${() => {
                        model.appState.value.closeOverlay()
                    }}">Fertig
                    </cc-button>
                </div>
            `
        } else {
            return html`
                <style>${styles}</style>
                ${this.getModalContent()}
                <div class="navigation">
                    <cc-button color="${ColorEnum.GRAY}" @click="${() => {
                        model.appState.value.closeOverlay()
                    }}">Abbrechen
                    </cc-button>
                    ${!this.isEditMode ? html`
                        <cc-button .disabled="${!this.isFinishable}" @click="${() => {
                            this.createElement(this.element)
                        }}">Erstellen
                        </cc-button>` : html`
                    `}
                </div>
            `
        }
    }

    createElement(element: DeviceTypeFullDTO) {
        DeviceTypeService.create((element as DeviceTypeFullDTO).deviceType, this.tags)
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

    updateDeviceType(type: DeviceType) {
        if (this.isEditMode) DeviceTypeService.update(type);
    }

    private updateDevice(element: Device) {
        if (this.isEditMode) DeviceService.update(element);
    }

    setType(type: DeviceTypeVariantEnum) {
        this.currentEditType = type;
        this.element = {
            deviceType: {} as DeviceType,
            available: 0,
            deviceTags: []
        } as DeviceTypeFullDTO;

        switch (type) {
            case DeviceTypeVariantEnum.camera:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.camera} as CameraType;
                break;
            case DeviceTypeVariantEnum.drone:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.drone} as DroneType;
                break;
            case DeviceTypeVariantEnum.microphone:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.microphone} as MicrophoneType;
                break;
            case DeviceTypeVariantEnum.lens:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.lens} as LensType;
                break;
            case DeviceTypeVariantEnum.light:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.light} as LightType;
                break;
            case DeviceTypeVariantEnum.audio:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.audio} as AudioType;
                break;
            case DeviceTypeVariantEnum.stabilizer:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.stabilizer} as StabilizerType;
                break;
            case DeviceTypeVariantEnum.tripod:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.tripod} as TripodType;
                break;
            case DeviceTypeVariantEnum.simple:
                this.element.deviceType = {variant: DeviceTypeVariantEnum.simple} as SimpleType;
                break;
        }
    }

    getModalContent() {
        this.element = this.element as DeviceTypeFullDTO;
        this.currentEditType = this.element.deviceType.variant;
        let deviceType = this.element.deviceType;
        let tags = this.element.deviceTags;

        return html`
            <h1>Gerätetyp ${this.isEditMode ? 'Bearbeiten' : 'Erstellen'}</h1>
            <cc-input label="Name" text="${deviceType.name}" .onInput="${(value) => {
                deviceType.name = value;
                this.isFinishable = value.length >= 2;
            }}"></cc-input>
            <cc-input label="Bild" type="${InputType.UPLOAD}"></cc-input>
            <div class="separator">
                <cc-line></cc-line>
            </div>
            <div class="contentByDeviceType">${this.getModalContentByDeviceType()}</div>
            <div class="separator">
                <cc-line></cc-line>
            </div>
            <div class="tags">  
                <cc-autocomplete label="Tags" class="tagSelector" color="${ColorEnum.GRAY}"
                                 size="${SizeEnum.MEDIUM}"
                                 .onSelect="${(option: Tag) => {
                                     this.tags.push(option);
                                     if (this.isEditMode) {
                                         DeviceTypeService.toggleTag(option, (this.element as DeviceTypeFullDTO).deviceType);
                                     }
                                 }}"
                                 .querySuggestions="${TagService.search}"}"
                                 .contentProvider="${(data: Tag) => {
                                     return `${data.name}`
                                 }}"
                                 .iconProvider="${() => {
                                     return html`${unsafeSVG(icon(faTag).html[0])}`
                                 }}">
                </cc-autocomplete>
                <div>
                    ${this.tags.map(elem => {
                        return html`
                            <cc-chip text="${elem.name}" color="${ColorEnum.GRAY}" type="${ChipType.REMOVABLE}"
                                     @click="${() => {
                                         this.tags.slice(tags.indexOf(elem), 1);
                                         if (this.isEditMode) {
                                             DeviceTypeService.toggleTag(elem, (this.element as DeviceTypeFullDTO).deviceType);
                                         }
                             }}"></cc-chip>`;
                    })}
                </div>
            </div>
        `;
    }

    getModalContentByDeviceType() {
        let deviceType = this.element as DeviceTypeFullDTO;
        switch (this.currentEditType) {
            case DeviceTypeVariantEnum.camera:
                let cameraType = deviceType.deviceType as CameraType;
                return html`
                    <div>
                        <p>Objektiv Anschluss</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.lensMounts?.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{id: cameraType?.mount?.attribute_id, data: cameraType?.mount?.name}}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    cameraType.mount = model.deviceTypeAttributes.value.lensMounts.find(elem => elem.attribute_id == option.id);
                                    this.updateDeviceType(cameraType);
                                }}"
                        </cc-dropdown>
                    </div>
                    <div>
                        <p>System</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.cameraSystems?.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{id: cameraType?.system?.attribute_id, data: cameraType?.system?.name}}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    cameraType.system = model.deviceTypeAttributes.value.cameraSystems.find(elem => elem.attribute_id == option.id);
                                    this.updateDeviceType(cameraType);
                                }}"
                                align="right">
                    </div>
                    <div>
                        <p>Foto Auflösung</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.cameraResolutions?.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{
                                    id: cameraType?.photo_resolution?.attribute_id,
                                    data: cameraType?.photo_resolution?.name
                                }}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    cameraType.photo_resolution = model.deviceTypeAttributes.value.cameraResolutions.find(elem => elem.attribute_id == option.id);
                                    this.updateDeviceType(cameraType);
                                }}">
                        </cc-dropdown>
                    </div>
                    <cc-toggle .toggled="${cameraType.autofocus}" .onToggle="${(option => {
                        cameraType.autofocus = option;
                        this.updateDeviceType(cameraType);
                    })}">Autofokus
                    </cc-toggle>
                `;

            case DeviceTypeVariantEnum.drone:
                let droneType = deviceType.deviceType as DroneType;
                return html`
                    <cc-input label="Maximale Reichweite (km)" text="${droneType.max_range_kilometers}"
                              .onInput="${text => {
                                  droneType.max_range_kilometers = text
                                  DeviceTypeService.update(droneType)
                              }}"></cc-input>
                    <cc-input label="Maximale Flugzeit (min)" text="${droneType.flight_time_minutes}"
                              .onInput="${text => {
                                  droneType.flight_time_minutes = text
                                  DeviceTypeService.update(droneType)
                              }}"></cc-input>
                    <cc-toggle .toggled="${droneType.requires_license}" .onToggle="${value => {
                        droneType.requires_license = value
                        DeviceTypeService.update(droneType)
                    }}">Benötigt Lizenz
                    </cc-toggle>
                `
            case DeviceTypeVariantEnum.lens:
                let lensType = deviceType.deviceType as LensType
                return html`
                    <div>
                        <p>Anschluss</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.lensMounts.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{id: lensType?.mount?.attribute_id, data: lensType?.mount?.name}}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    lensType.mount = model.deviceTypeAttributes.value.lensMounts.find(elem => elem.attribute_id == option.id)
                                    DeviceTypeService.update(lensType)
                                }}"
                        ></cc-dropdown>
                    </div>
                    <cc-input label="Maximale Blende" text="${lensType.f_stop}" .onInput="${text => {
                        lensType.f_stop = text
                        DeviceTypeService.update(lensType)
                    }}"></cc-input>
                    <cc-input label="Brennweite" text="${lensType.focal_length}" .onInput="${text => {
                        lensType.focal_length = text
                        DeviceTypeService.update(lensType)
                    }}"></cc-input>
                `
            case DeviceTypeVariantEnum.light:
                let lightType = deviceType.deviceType as LightType
                return html`
                    <cc-toggle .toggled="${lightType.rgb}" .onToggle="${value => {
                        lightType.rgb = value
                        DeviceTypeService.update(lightType)
                    }}">RGB Farben
                    </cc-toggle>
                    <cc-input label="Stärke (Watt)" text="${lightType.watts}" .onInput="${text => {
                        lightType.watts = text
                        DeviceTypeService.update(lightType)
                    }}"></cc-input>
                    <cc-toggle .toggled="${lightType.variable_temperature}" .onToggle="${value => {
                        lightType.variable_temperature = value
                        DeviceTypeService.update(lightType)
                    }}">Farbtemperatur verstellbar
                    </cc-toggle>
                `

            case DeviceTypeVariantEnum.audio:
                let audioType = deviceType.deviceType as AudioType

                return html`
                    <div>
                        <p>Stecker</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.audioConnectors?.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{
                                    id: audioType?.connector?.attribute_id,
                                    data: audioType?.connector?.name
                                }}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    audioType.connector = model.deviceTypeAttributes.value.audioConnectors.find(elem => elem.attribute_id == option.id)
                                    DeviceTypeService.update(audioType)
                                }}"
                        ></cc-dropdown>
                    </div>`

            case DeviceTypeVariantEnum.microphone:
                let microphoneType = deviceType.deviceType as MicrophoneType
                return html`
                    <div>
                        <p>Audio Connector</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.audioConnectors?.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{
                                    id: microphoneType?.connector?.attribute_id,
                                    data: microphoneType?.connector?.name
                                }}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    microphoneType.connector = model.deviceTypeAttributes.value.audioConnectors.find(elem => elem.attribute_id == option.id)
                                    DeviceTypeService.update(microphoneType)
                                }}"
                        ></cc-dropdown>
                    </div>
                    <cc-toggle .toggled="${microphoneType.needs_recorder}" .onToggle="${value => {
                        microphoneType.needs_power = value
                        DeviceTypeService.update(microphoneType)
                    }}">Benötigt Stromversorgung
                    </cc-toggle>
                    <cc-toggle .toggled="${microphoneType.needs_recorder}" .onToggle="${value => {
                        microphoneType.needs_recorder = value
                        DeviceTypeService.update(microphoneType)
                    }}">Benötigt externes Aufnahmegerät
                    </cc-toggle>
                `

            case DeviceTypeVariantEnum.stabilizer:
                let stabilizerType = deviceType.deviceType as StabilizerType
                return html`
                    <cc-input label="Maximales Gewicht (kg)" text="${stabilizerType.max_weight_kilograms}"
                              .onInput="${text => {
                                  stabilizerType.max_weight_kilograms = text
                                  DeviceTypeService.update(stabilizerType)
                              }}"></cc-input>
                    <cc-input label="Anzahl stabilisierter Achsen" text="${stabilizerType.number_of_axis}"
                              .onInput="${text => {
                                  stabilizerType.number_of_axis = text
                                  DeviceTypeService.update(stabilizerType)
                              }}"></cc-input>
                `
            case DeviceTypeVariantEnum.tripod:
                let tripodType = deviceType.deviceType as TripodType
                return html`
                    <div>
                        <p>Head</p>
                        <cc-dropdown
                                align="right"
                                .options="${model.deviceTypeAttributes.value.tripodHeads.map(option => ({
                                    id: option.attribute_id,
                                    data: option.name
                                }))}"
                                .selected="${{id: tripodType?.head?.attribute_id, data: tripodType?.head?.name}}"
                                .onSelect="${(option: { id: number, data: string }) => {
                                    tripodType.head = model.deviceTypeAttributes.value.tripodHeads.find(elem => elem.attribute_id == option.id)
                                    DeviceTypeService.update(tripodType)
                                }}"
                        ></cc-dropdown>
                    </div>
                    <cc-input label="Höhe (cm)" text="${tripodType.height_centimeters}" .onInput="${text => {
                        tripodType.height_centimeters = text
                        DeviceTypeService.update(tripodType)
                    }}"></cc-input>
                `
            case DeviceTypeVariantEnum.simple:
                let simpleType = deviceType.deviceType as SimpleType
                return html`
                    <cc-input label="Beschreibung" text="${simpleType.description}" .onInput="${text => {
                        simpleType.description = text
                        DeviceTypeService.update(simpleType)
                    }}"></cc-input>
                    </div>
                `
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit-device-type-modal": EditDeviceTypeModalComponent;
    }
}
import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ObservedProperty} from "../../../model";
import DeviceTypeService, {DeviceType, DeviceTypeSource} from "../../../service/deviceType.service";
import {model} from "../../../index";
import styles from '../../../../styles/components/app/edit/editModal.styles.scss';
import {AppState} from "../../../AppState";
import TagService, {Tag} from "../../../service/tag.service";
import {InputType} from "../../basic/input.component";
import {ColorEnum, SizeEnum} from "../../../base";
import {ChipType} from "../../basic/chip.component";
import {DeviceStatus} from "../../../service/device.service";
import {unsafeSVG} from "lit/directives/unsafe-svg.js";
import {icon} from "@fortawesome/fontawesome-svg-core";
import {faTag, faXmark} from "@fortawesome/free-solid-svg-icons";
import PopupEngine from "../../../util/PopupEngine"
import DeviceSetService, {DeviceSetCreateDTO, DeviceTypeStatusEnum} from "../../../service/deviceSet.service"

@customElement('cc-edit-device-set-modal')
export class EditDeviceSetModalComponent extends LitElement {
    @property() private element: DeviceSetCreateDTO | null;
    @property() private elementId: number | null = null;
    @property() private appState: ObservedProperty<AppState>;
    @property() private isEditMode: boolean = true;
    private deviceTypes: DeviceType[] = [];

    startElement: DeviceSetCreateDTO | null = null;
    tags: Tag[] = [];

    // todo if the device is in create mode it should get a warning before tabing out of the model

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
                status: DeviceTypeStatusEnum.ACTIVE,
                tags: []
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
        this.tags = this.element.tags;
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
                    }}"></cc-input>
                </div>
                <div class="separator">
                    <cc-line></cc-line>
                </div>
                <cc-toggle .toggled="${this.element.status == DeviceTypeStatusEnum.ACTIVE}" .onToggle="${(option => {
                    this.element.status = option ? DeviceTypeStatusEnum.ACTIVE : DeviceTypeStatusEnum.DISABLED;
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
                        ${this.deviceTypes.map(deviceType => html`
                            <div>
                                <p>${deviceType.name}</p>
                                <icon-cta @click="${() => {
                                        this.deviceTypes = this.deviceTypes.filter(dt => dt.type_id !== deviceType.type_id);
                                        this.element.deviceTypeIds = this.element.deviceTypeIds.filter(id => id !== deviceType.type_id);
                                        this.updateDeviceSet(this.element);
                                }}">
                                    ${unsafeSVG(icon(faXmark).html[0])}</icon-cta>
                            </div>`
                        )}
                    </div>
                </div>
                
                <div class="separator">
                    <cc-line></cc-line>
                </div>
                
                <div class="tags">  
                <cc-autocomplete label="Tags" class="tagSelector" color="${ColorEnum.GRAY}"
                     size="${SizeEnum.MEDIUM}"
                     .onSelect="${(option: Tag) => {
                                if (this.isEditMode) {
                                    DeviceSetService.toggleTag(option, this.elementId)
                                    this.tags.push(option);
                                } else {
                                    this.element.tags.push(option);
                                }
                            }}"
                            .querySuggestions="${TagService.search}"
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
                                if (this.isEditMode) {
                                    DeviceSetService.toggleTag(elem, this.elementId)
                                    this.tags.slice(this.tags.indexOf(elem), 1);
                                } else{
                                    this.element.tags.slice(this.element.tags.indexOf(elem), 1);
                                }
                            }}"></cc-chip>`;
                        })}
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
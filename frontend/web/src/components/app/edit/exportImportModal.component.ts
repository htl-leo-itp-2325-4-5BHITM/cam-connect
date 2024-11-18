import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditPageEnum, ObservedProperty} from "../../../model";
import {model} from "../../../index";
import styles from '../../../../styles/components/app/edit/exportImportModal.styles.scss';
import {AppState} from "../../../AppState";
import DeviceTypeService, {ImportFeedbackDividerDTO, ImportFeedbackDTO} from "../../../service/deviceType.service"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {
    faArrowUpFromBracket,
    faDownload,
    faFileArrowDown,
    faUpload,
    faUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons"
import {ColorEnum} from "../../../base"
import DeviceService from "../../../service/device.service"

@customElement('cc-export-import-modal')
export class ExportImportModalComponent extends LitElement {
    @property() private appState: ObservedProperty<AppState>;
    @property({type: String}) private renderState: "default" | "loading" | "import" = "default";

    private type: "devicetype" | "device" = "devicetype";

    @property()
    private selectedExportTypes: (string | number)[] = [];

    private importFeedback : ImportFeedbackDividerDTO = {} as ImportFeedbackDividerDTO;

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState);
    }

    connectedCallback() {
        super.connectedCallback();
        model.deviceTypeNameFilterOptions.value.map((option) => {
            this.selectedExportTypes.push(option.id);
        });
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        console.log("rendering export import modal");

        if (this.renderState === "loading") {
            return html`
                <div class="spinner">Loading ...</div>
            `;
        }

        if (this.renderState === "import") {
            return html`
                <h2>Es sind bei ${this.importFeedback.incorrect?.length} Einträgen Fehler aufgetreten:</h2>
                ${
                    this.importFeedback.incorrect?.map((feedback) => {
                        return html`
                                <div class="import-feedback">
                                    <p>${feedback.message}</p>
                                </div>
                            `;
                    })
                }
                
                <h2>Es wurden ${this.importFeedback.correct?.length} Einträge erfolgreich importiert:</h2>
                ${
                    this.importFeedback.correct?.map((feedback) => {
                        return html`
                                <div class="import-feedback">
                                    <p>${feedback.message}</p>
                                </div>
                            `;
                    })
                }
            `
        }

        return html`
            <style>${styles}</style>
            ${this.generateModalContent()}
        `;
    }

    handleFileUpload(event: Event) {
        this.renderState = "loading";
        this.requestUpdate();

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            if (this.type === "devicetype") {
                DeviceTypeService.importDeviceTypes(file).then((data) => {
                    this.importFeedback = data.data;

                    this.renderState = "import";
                    this.requestUpdate();
                });
            } else {
                DeviceService.importDevices(file);
            }
        }
    }

    generateModalContent() {
        return html`
            <cc-select>
                <cc-option value="1" @click="${() => {this.type = 'devicetype'}}" class="selected">Gerätetypen</cc-option>
                <cc-option value="2" @click="${() => {this.type = 'device'}}">Geräte</cc-option>
            </cc-select>

            <div class="import">
                <button class="import">
                    <label for="file-upload" class="custom-input">
                        <p>Importieren</p>

                        <div class="icon">
                            ${unsafeSVG(icon(faArrowUpFromBracket).html[0])}
                        </div>
                    </label>

                    <input id="file-upload" type="file" @change="${this.handleFileUpload}"/>
                </button>

                <div class="info">
                    <p>import dokumentation</p>
                    <div class="small">
                        ${unsafeSVG(icon(faUpRightFromSquare).html[0])}
                    </div>
                </div>
            </div>

            <div class="export">
                ${
                        this.type === "devicetype" ? html`
                            <div class="checkboxes">
                                ${
                                        model.deviceTypeNameFilterOptions.value.map((option) => {
                                            return html`
                                                <cc-checkbox .state="${true}" @click="${() => {
                                                    if (this.selectedExportTypes.includes(option.id)) {
                                                        this.selectedExportTypes = this.selectedExportTypes.filter((id) => id !== option.id);
                                                    } else {
                                                        this.selectedExportTypes.push(option.id);
                                                    }
                                                }}">${option.name}</cc-checkbox>
                                            `;
                                        })
                                }
                            </div>
                        ` : ''
                }

                <button @click="${
                        () => {
                            if (this.type === "devicetype") {
                                DeviceTypeService.exportDeviceTypes(this.selectedExportTypes);
                            } else {
                                DeviceService.exportDevices();
                            }
                        }
                }">
                    <p>Exportieren</p>
                    <div class="icon">
                        ${unsafeSVG(icon(faFileArrowDown).html[0])}
                    </div>
                </button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-export-import-modal": ExportImportModalComponent;
    }
}
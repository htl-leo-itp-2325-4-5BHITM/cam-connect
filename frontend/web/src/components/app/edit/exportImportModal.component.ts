import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {EditPageEnum, ObservedProperty} from "../../../model";
import {model} from "../../../index";
import styles from '../../../../styles/components/app/edit/exportImportModal.styles.scss';
import {AppState} from "../../../AppState";
import DeviceTypeService from "../../../service/deviceType.service"
import {unsafeSVG} from "lit/directives/unsafe-svg.js"
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faDownload, faUpload} from "@fortawesome/free-solid-svg-icons"

@customElement('cc-export-import-modal')
export class ExportImportModalComponent extends LitElement {
    @property() private appState: ObservedProperty<AppState>;

    private type : "devicetype" | "device" = "devicetype";

    @property()
    private selectedExportTypes: (string | number)[] = [];

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        return html`
            <style>${styles}</style>
            ${this.getModalContent()}
        `;
    }

    getModalContent() {
        return html`
            <cc-select>
                <cc-option value="1" @click="${() => {this.type = 'devicetype'}}" class="selected">Gerätetypen</cc-option>
                <cc-option value="2" @click="${() => {this.type = 'device'}}">Geräte</cc-option>
            </cc-select>

            <div class="import">
                <label for="file-upload" class="custom-input">
                    <p>Importieren</p>
                    
                    <div class="icon">
                        ${unsafeSVG(icon(faUpload).html[0])}
                    </div>
                </label>
                <input id="file-upload" type="file" />
            </div>
            
            <div class="options">
                <div class="checkboxes">
                    ${
                        model.deviceTypeNameFilterOptions.value.map((option) => {
                            this.selectedExportTypes.push(option.id);
                            
                            return html`
                                <cc-checkbox .state="${true}" @click="${() => {
                                    if(this.selectedExportTypes.includes(option.id)){
                                        this.selectedExportTypes = this.selectedExportTypes.filter((id) => id !== option.id);
                                    } else{
                                        this.selectedExportTypes.push(option.id);
                                    }
                                }}">${option.name}</cc-checkbox>
                            `
                        })
                    }
                </div>
                
                <cc-button @click="${
                    () => {
                        if(this.type == "devicetype"){
                            DeviceTypeService.exportDeviceTypes(this.selectedExportTypes).then((data) => {
                                console.log(data)
                                /*
                                // Convert data array to CSV string
                                let csvContent = "data:text/csv;charset=utf-8,"
                                        + data.map(e => e.join(",")).join("\n");

                                // Create a link element
                                let link = document.createElement("a");
                                link.setAttribute("href", encodeURI(csvContent));
                                link.setAttribute("download", "data.csv");

                                // Append the link to the body
                                document.body.appendChild(link);

                                // Simulate click to trigger download
                                link.click();

                                // Remove the link after download
                                document.body.removeChild(link);  */
                            })
                        }
                    }
                }">Exportieren</cc-button>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-export-import-modal": ExportImportModalComponent;
    }
}
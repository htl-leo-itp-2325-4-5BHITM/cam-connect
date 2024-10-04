import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/deviceListEntry.styles.scss'
import {ButtonType} from "../basic/button.component"
import {ColorEnum} from "../../base"
import DeviceTypeService, {DeviceTypeSource, DeviceTypeVariantEnum} from "../../service/deviceType.service"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import {model} from "../../index"
import {DeviceSetFullDTO} from "../../service/deviceSet.service"

@customElement('cc-device-set-list-entry')
export class DeviceSetListEntryComponent extends LitElement {
    @property()
    deviceSet?: DeviceSetFullDTO

    @property()
    private appState: ObservedProperty<AppState>

    @property({type: Boolean, reflect: true})
    isSelected: boolean = false

    @property({type: Boolean, reflect: true})
    isSelectable: boolean = false

    @property({type: Boolean, reflect: true})
    isListMode: boolean = false

    constructor() {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('click', (e) => {
            let target = e.composedPath()[0] as HTMLElement

            if (target.closest("icon-cta")?.tagName != "ICON-CTA" && target.closest("button")?.tagName != "BUTTON" && this.deviceSet.available > 0) {
                this.toggleDeviceCheck(true)
            }
        })

        model.appState.subscribe(() => {
            this.isSelected = this.isChecked()
        })
    }

    render() {
        return html`
            <style>${styles}</style>

            ${this.isListMode ? this.renderDeviceTypeIcon() : ''}

            <h3>${this.deviceSet.deviceSet.name}</h3>
            ${this.deviceSet.deviceSet.tags.length != 0 ?
                    html`
                        <div class="tags">
                            ${
                                    this.deviceSet.deviceSet.tags.map(tag => {
                                        return html`
                                            <cc-chip color="${ColorEnum.GRAY}" text="${tag.name}"
                                                     tooltip="${tag.description}"></cc-chip>`
                                    })
                            }
                        </div>` : ''
            }
            ${this.isListMode ? '' : html`
                <cc-line></cc-line>`}
            
            <section>
                <div class="details">
                    ${
                            this.deviceSet.deviceSet.device_types.map(deviceType => {
                                return html`<p> - ${deviceType.name}</p>`
                            })
                    }
                </div>
                
                <div class="image">
                    ${this.renderDeviceTypeIcon()}
                </div>
            </section>
            
            ${this.isListMode ? '' : html`
                <cc-line></cc-line>`}
            <div class="bottom">
                <cc-chip
                        color="${this.deviceSet.available > 0 ? ColorEnum.GOOD : ColorEnum.BAD}"
                        text="${this.deviceSet.available > 0 ? (this.deviceSet.available + ' Verfügbar') : 'Vergeben'}"
                ></cc-chip>
                <cc-button type="${ButtonType.OUTLINED}" .disabled="${this.deviceSet.available == 0}"
                           @click="${() => {
                               this.toggleDeviceCheck()
                               model.appState.value.openCreateRentModalWithDevices(this.appState.value.selectedSetEntries, "set")
                           }}"
                >Verleihen
                </cc-button>
            </div>
            <cc-circle-select
                    .checked="${this.appState.value.selectedSetEntries.has(this)}"
                    .disabled="${this.deviceSet.available == 0}"
                    @click="${() => {
                        if (this.deviceSet.available > 0) this.toggleDeviceCheck()
                    }}"
            ></cc-circle-select>
        `
    }

    refreshSelectionState() {
        this.isSelected = this.isChecked()
        this.isSelectable = this.appState.value.selectedDeviceEntries.size > 0 && this.deviceSet.available > 0
    }

    renderDeviceTypeIcon() {
        return html`
            <div class="image">
                ${
                        DeviceTypeService.deviceTypeToIcon(DeviceTypeVariantEnum.simple)
                }
            </div>
        `
    }

    toggleDeviceCheck(isSimpleClick?: boolean) {
        if (!isSimpleClick || this.appState.value && this.appState.value.selectedDeviceEntries.size > 0) {
            if (!this.isChecked()) {
                this.appState.value.addSelectedSetEntry(this)
            } else {
                this.appState.value.removeSelectedSetEntry(this)
            }
        }
    }

    isChecked() {
        return this.appState.value?.selectedSetEntries?.has(this)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-set-list-entry": DeviceSetListEntryComponent
    }
}
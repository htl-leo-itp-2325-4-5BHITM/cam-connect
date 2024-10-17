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
import {UserRoleEnum} from "../../service/user.service"

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
            
            <div>
                <p>${this.deviceSet.deviceSet.description}</p>
            </div>
            
            <section>
                <div class="details">
                    ${
                            this.deviceSet.deviceSet.device_types.map(deviceType => {
                                return html`<p> - ${deviceType.name}</p>`
                            })
                    }
                </div>
                
                <div class="image">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><g>   <g id="Layer_1">   <g>   <path d="M12.2,22.4h-4c-.9,0-1.6.7-1.6,1.6s.7,1.6,1.6,1.6h4c.9,0,1.6-.7,1.6-1.6s-.7-1.6-1.6-1.6Z"/>   <path d="M77.2,40.8c7,0,12.6-5.7,12.6-12.6v-12.2c0-6.9-5.6-12.6-12.6-12.6s-12.6,5.7-12.6,12.6v12.2c0,6.9,5.6,12.6,12.6,12.6ZM67.3,28.3v-12.3c0-.3,0-.5,0-.8h0s0,0,0,0h0s0,0,0,0c0,0,0,0,0,0,.4-4.5,3.8-8.2,8.2-8.9.1,0,.3,0,.4,0,.1,0,.3,0,.4,0,.2,0,.5,0,.8,0,0,0,0,0,0,0h0s0,0,.1,0c.2,0,.5,0,.7,0,.1,0,.3,0,.4,0,.1,0,.2,0,.3,0,4.4.7,7.9,4.4,8.3,8.9,0,0,0,0,0,0h0c0,.3,0,.5,0,.8v12.3c0,.3,0,.5,0,.8h0s0,0,0,0c-.4,4.5-3.8,8.2-8.3,8.9-.1,0-.2,0-.3,0-.1,0-.3,0-.4,0-.2,0-.5,0-.7,0,0,0,0,0-.1,0h0s0,0,0,0c-.3,0-.5,0-.7,0-.1,0-.3,0-.4,0-.1,0-.3,0-.4,0-4.4-.7-7.9-4.4-8.2-8.9,0,0,0,0,0,0h0c0-.3,0-.5,0-.8Z"/>   <path d="M26,21.1c-6.4,0-11.5,5.2-11.5,11.5s5.2,11.5,11.5,11.5,11.5-5.2,11.5-11.5-5.2-11.5-11.5-11.5ZM26,40.9c-4.6,0-8.3-3.7-8.3-8.3s3.7-8.3,8.3-8.3,8.4,3.7,8.4,8.3-3.7,8.3-8.4,8.3Z"/>   <path d="M50.8,45.1v-25.1c0-2-1.6-3.5-3.5-3.5h-4.4v-1.2c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6,1.6v1.2h-6.2l-1.3-3.4c-.2-.6-.8-1-1.5-1h-9.5c-.7,0-1.2.4-1.5,1l-1.3,3.4H4.7c-1.9,0-3.5,1.6-3.5,3.5v25.1c0,2,1.6,3.5,3.5,3.5h42.5c1.9,0,3.5-1.6,3.5-3.5ZM22.3,15.3h7.3l.5,1.2h-8.2l.5-1.2ZM4.4,45.1v-25.1c0-.2.2-.4.4-.4h42.5c.2,0,.4.2.4.4v25.1c0,.2-.2.4-.4.4H4.7c-.2,0-.4-.2-.4-.4Z"/>   <path d="M74.6,71.2c-.4-.3-1-.4-1.4-.2l-9.2,3.1v-1.2c0-2.2-1.8-4-4-4h-2.9c.5-.9.8-2,.8-3.2,0-3.5-2.8-6.3-6.3-6.3s-6.3,2.8-6.3,6.3.3,2.2.8,3.2h-3.3c1.9-1.9,3-4.5,3-7.3,0-5.8-4.7-10.5-10.5-10.5s-10.5,4.7-10.5,10.5,1.1,5.4,3,7.3h-1.6c-2.2,0-4,1.8-4,4v21.8c0,2.2,1.8,4,4,4h33.9c2.2,0,4-1.8,4-4v-1.2l9.2,3.1c.2,0,.3,0,.5,0,.3,0,.7-.1.9-.3.4-.3.7-.8.7-1.3v-22.7c0-.5-.2-1-.7-1.3ZM51.6,62.6c1.7,0,3.1,1.4,3.1,3.2s-1.4,3.2-3.1,3.2c-1.7,0-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2ZM35.2,54.2c4,0,7.3,3.3,7.3,7.3s-3.3,7.3-7.3,7.3-7.3-3.3-7.3-7.3,3.3-7.3,7.3-7.3ZM60.8,94.7c0,.4-.4.8-.8.8H26.1c-.4,0-.8-.4-.8-.8v-21.8c0-.4.4-.8.8-.8h33.9c.4,0,.8.4.8.8v21.8ZM72.1,92.9l-8.1-2.7v-12.8l8.1-2.7v18.2Z"/>   <path d="M94.9,23.3c-1.9,0-3.5,1.5-3.5,3.5v1.5c0,3.8-1.5,7.3-4.2,10-2.7,2.7-6.3,4.2-10,4.2s-7.3-1.5-10-4.2c-2.7-2.7-4.2-6.3-4.2-10v-1.5c0-1.9-1.5-3.5-3.5-3.5s-3.5,1.5-3.5,3.5v1.5c0,5.6,2.2,10.9,6.2,14.9,3.1,3.1,7.1,5.2,11.5,5.9v8.4h-6.1c-1.9,0-3.5,1.5-3.5,3.5s1.5,3.5,3.5,3.5h19c1.9,0,3.5-1.6,3.5-3.5s-1.5-3.5-3.5-3.5h-6.1v-8.4c4.3-.7,8.3-2.8,11.5-5.9,4-4,6.2-9.3,6.2-14.9v-1.5c0-1.9-1.5-3.5-3.5-3.5ZM95.7,28.2h0c0,4.9-1.9,9.5-5.4,13-3,3-6.9,4.9-11,5.3-.7,0-1.2.6-1.2,1.3v10.9c0,.7.6,1.3,1.3,1.3h7.4c.4,0,.8.4.8.8s-.4.8-.8.8h-19c-.4,0-.8-.4-.8-.8s.4-.8.8-.8h7.4c.7,0,1.3-.6,1.3-1.3v-10.9c0-.7-.5-1.2-1.2-1.3-4.1-.4-8.1-2.3-11-5.3-3.5-3.5-5.4-8.1-5.4-13v-1.5c0-.4.4-.8.8-.8s.8.4.8.8v1.5c0,4.5,1.8,8.7,5,11.9,3.2,3.2,7.4,5,11.9,5s8.7-1.8,11.9-5,5-7.4,5-11.9v-1.5c0-.4.4-.8.8-.8s.8.4.8.8v1.5Z"/>   <path d="M50.9,81.6l-10.8-6.2c-.8-.5-1.8-.5-2.5,0-.8.5-1.3,1.3-1.3,2.2v12.5c0,.9.5,1.8,1.3,2.2.4.2.8.3,1.3.3s.9-.1,1.3-.3l10.8-6.2c.8-.5,1.3-1.3,1.3-2.2s-.5-1.8-1.3-2.2ZM39.5,89v-10.3l8.9,5.2-8.9,5.2Z"/> </g> </g> </g></svg>
                </div>
            </section>
            
            ${this.isListMode ? '' : html`
                <cc-line></cc-line>`}
            <div class="bottom">
                <cc-chip
                        color="${this.deviceSet.available > 0 ? ColorEnum.GOOD : ColorEnum.BAD}"
                        text="${this.deviceSet.available > 0 ? (this.deviceSet.available + ' Verfügbar') : 'Vergeben'}"
                ></cc-chip>
                ${model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ?
                        html`
                            <cc-button type="${ButtonType.OUTLINED}" .disabled="${this.deviceSet.available == 0}"
                                       @click="${() => {
                                           this.appState.value.selectedSetEntries.clear()
                                           this.appState.value.selectedSetEntries.add(this)
                                           this.appState.value.openCreateRentModalWithDevices(this.appState.value.selectedSetEntries, "set")
                                       }}"
                            >Verleihen
                            </cc-button>
                    ` : ""
                }
            </div>

            ${model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ?
                    html`
                        <cc-circle-select
                                .checked="${this.appState.value.selectedSetEntries.has(this)}"
                                .disabled="${this.deviceSet.available == 0}"
                                @click="${() => {
                                    if (this.deviceSet.available > 0) this.toggleDeviceCheck()
                                }}"
                        ></cc-circle-select>
                ` : ""
            }
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
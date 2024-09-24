import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/navigation/sidebar.styles.scss'
import { ButtonComponent, ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {filter} from "rxjs"
import {Orientation, SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {EditPageEnum, ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import UrlHandler from "../../util/UrlHandler"
import {DeviceTypeVariantEnum} from "../../service/deviceType.service"
import {Tooltip} from "../../util/Tooltip"
import {EditComponent} from "../app/edit/edit.component"

@customElement('cc-sidebar')
export class SidebarComponent extends LitElement {
    @property({reflect: true})
    type: "default" | "edit" = "default"

    @property({type:String})
    accountname?: string = 'No username provided'

    @queryAssignedElements({slot: "primaryFilters", selector: "[affectSecondaryFilters]"})
    private controlFilters!: Array<HTMLElement>;

    @queryAssignedElements({slot: "secondaryFilters"})
    private secondaryFilters!: Array<HTMLElement>;

    @property()
    private appState: ObservedProperty<AppState>

    constructor(username: string) {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        this.accountname = username
        model.appState.value.sidebarElement = this
    }

    render() {
        if(this.type == "default") {
            return html`
                <style>${styles}</style>
                <div class="buttons">
                    <cc-button size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.ACCENT}" type="${ButtonType.FILLED}"
                       @click="${() => {
                           model.appState.value.openCreateRentModal()
                       }}"
                       @mouseenter="${(e) => {
                           Tooltip.show(e.target, 'shift+n oder <', 500)
                       }}"
                                          @mouseleave="${() => {
                           Tooltip.hide(0)
                       }}"
                    >
                        Neuer Verleih
                    </cc-button>
                    <cc-button size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.ACCENT}" type="${ButtonType.OUTLINED}" disabled>
                        Multi Verleih
                    </cc-button>
                </div>
                <cc-line></cc-line>
                <div class="sorts">
                    <slot name="sorts"></slot>
                </div>
                <cc-line></cc-line>
                <div class="filters">
                    <div class="primaryFilters">
                        <slot name="primaryFilters" @slotchange=${this.handlePrimaryFilterChange}></slot>
                    </div>
                    <cc-line></cc-line>
                    <div class="secondaryFilters">
                        <slot name="secondaryFilters"></slot>
                    </div>
                </div>
    
                <div class="user" @click="${() => {
                    UrlHandler.goToPage('/app/user')
                }}">
                    <img src="../../../assets/icon/user-icon-default.svg" alt="user">
                    <p>${(this.accountname)}</p>
                </div>
            `
        }
        else {
            return html`
                <style>${styles}</style>
                <div class="buttons">
                    <cc-button size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.ACCENT}" type="${ButtonType.FILLED}"
                               @click="${() => {
                                   (model.appState.value.originElement as EditComponent).showModal(null, false, EditPageEnum.DEVICETYPE)
                               }}"
                               @mouseenter="${(e) => {
                                   Tooltip.show(e.target, 'shift+n oder <', 500)
                               }}"
                               @mouseleave="${() => {
                                   Tooltip.hide(0)
                               }}"
                    >
                        Neu Erstellen
                    </cc-button>
                </div>
                <cc-line></cc-line>
                <cc-select class="nav" size="${SizeEnum.MEDIUM}" type="${Orientation.VERTICAL}">
                    ${
                            model.deviceTypeNameFilterOptions.value.map(value => {
                                return html`
                                    <p class="${value.id as DeviceTypeVariantEnum == this.appState.value.editPageType ? 'selected' : ''}"
                                       @click="${() => {
                                           UrlHandler.updateUrl('/app/edit')
                                           UrlHandler.clearParams()
                                           UrlHandler.setParam("type", value.id as string)
                                           this.appState.value.clearSelectedDeviceEditEntries()
                                           this.appState.value.clearSelectedDeviceTypeEditEntries()
                                           this.appState.value.editPageType = value.id as DeviceTypeVariantEnum
                                       }}"
                                    >${value.name}</p>
                                `
                            })
                    }
                </cc-select>

                <div class="user" @click="${() => {
                    UrlHandler.goToPage('/app/user')
                }}">
                    <img src="../../../assets/icon/user-icon-default.svg" alt="user">
                    <p>${(this.accountname)}</p>
                </div>
            `
        }
    }

    setSecondaryFilterVisibility(){
        let selectedPrimaryFilters: (string | number)[] = []
        this.controlFilters.forEach((filter: FilterContainerComponent) => {
            selectedPrimaryFilters = selectedPrimaryFilters.concat(filter.getSelectedOptionsAsIdArray())
        })

        this.secondaryFilters.forEach((filter: FilterContainerComponent) => {
            if(filter.visibility.length == 0 || selectedPrimaryFilters.length == 0 || filter.visibility.some(visibilityRequirement => selectedPrimaryFilters.includes(visibilityRequirement))) {
                filter.style.display = "flex"
            }
            else {
                filter.style.display = "none"
                filter.clearSelection()
            }
        })
    }

    handlePrimaryFilterChange(){
        this.controlFilters.forEach((filter: FilterContainerComponent) => {
            filter.filterChange = () => {this.setSecondaryFilterVisibility()}
        })
    }

    selectSecondaryFilterById(id: string | number){
        this.secondaryFilters.forEach((secondaryFilter: FilterContainerComponent) => {
            secondaryFilter.selectOptionById(id)
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-sidebar": SidebarComponent
    }
}
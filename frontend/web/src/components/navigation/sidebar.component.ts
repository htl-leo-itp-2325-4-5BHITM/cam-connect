import {html, LitElement} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/navigation/sidebar.styles.scss'
import {ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {Orientation, SimpleColorEnum, SizeEnum} from "../../base"
import {model} from "../../index"
import {EditPageEnum, ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import UrlHandler from "../../util/UrlHandler"
import {DeviceTypeVariantEnum} from "../../service/deviceType.service"
import {Tooltip} from "../../util/Tooltip"
import {EditComponent} from "../app/edit/edit.component"
import {UserRoleEnum} from "../../service/user.service"

@customElement('cc-sidebar')
export class SidebarComponent extends LitElement {
    @property({reflect: true})
    type: "default" | "edit" = "default"

    @queryAssignedElements({slot: "primaryFilters", selector: "[affectSecondaryFilters]"})
    private controlFilters!: Array<HTMLElement>;

    @queryAssignedElements({slot: "secondaryFilters"})
    private secondaryFilters!: Array<HTMLElement>;

    @property()
    private appState: ObservedProperty<AppState>

    constructor(username: string) {
        super()
        this.appState = new ObservedProperty<AppState>(this, model.appState)
        model.appState.value.sidebarElement = this
    }

    render() {
        if(this.type == "default") {
            return html`
                <style>${styles}</style>
                ${ model.appState.value.currentUser?.role == UserRoleEnum.MEDT_TEACHER ? html`
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
                    </div>
                    <cc-line></cc-line>
                    ` : ""
                }
                
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
                    <p>${this.appState.value.currentUser?.firstname} ${this.appState.value.currentUser?.lastname}</p>
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
                                <div class="${value.id as DeviceTypeVariantEnum == this.appState.value.editPageType ? 'selected' : ''}"
                                     @click="${() => {
                                         if(this.appState.value.editPageType == null){
                                             UrlHandler.setUrl('/app/edit?type=' + value.id as string)
                                         } else{
                                             UrlHandler.updateUrl('/app/edit')
                                             UrlHandler.clearParams()
                                             UrlHandler.setParam("type", value.id as string)
                                         }

                                         this.appState.value.clearSelectedDeviceEditEntries()
                                         this.appState.value.clearSelectedDeviceTypeEditEntries()
                                         this.appState.value.clearSelectedDeviceSetEditEntries()
                                         this.appState.value.editPageType = value.id as DeviceTypeVariantEnum
                                         model.appState.value.editPage = EditPageEnum.OVERVIEW
                                     }}">
                                    <div class="point"></div>
                                    <p>${value.name}</>
                                </div>
                            `
                        })
                    }
                    
                    <div class="${model.appState.value.editPage == EditPageEnum.DEVICESET ? 'selected' : ''} deviceSet" @click="${() => {
                        if(this.appState.value.editPageType == null){
                            UrlHandler.setUrl('/app/edit?type=set')
                        } else{
                            UrlHandler.updateUrl('/app/edit')
                            UrlHandler.clearParams()
                            UrlHandler.setParam("type", "set")
                        }

                        this.appState.value.clearSelectedDeviceEditEntries()
                        this.appState.value.clearSelectedDeviceTypeEditEntries()
                        this.appState.value.clearSelectedDeviceSetEditEntries()
                        this.appState.value.editPageType = "set"
                        model.appState.value.editPage = EditPageEnum.DEVICESET
                    }}">
                        <div class="point"></div>
                        <p>Geräte-Set</p>
                    </div>
                </cc-select>

                <div class="user" @click="${() => {
                    UrlHandler.goToPage('/app/user')
                }}">
                    <img src="../../../assets/icon/user-icon-default.svg" alt="user">
                    <p>${this.appState.value.currentUser?.firstname} ${this.appState.value.currentUser?.lastname}</p>
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
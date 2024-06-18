import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/sidebar.styles.scss'
import { ButtonComponent, ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {filter} from "rxjs"
import {Orientation, SimpleColorEnum, SizeEnum, Tooltip} from "../../base"
import {model} from "../../index"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import URLHandler from "../../urlHandler"
import {DeviceTypeVariantEnum} from "../../service/deviceType.service"

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
    }

    render() {
        if(this.type == "default") {
            return html`
                <style>${styles}</style>
                <div class="buttons">
                    <cc-button size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.ACCENT}" type="${ButtonType.FILLED}"
                       @click="${this.openCreateRentMenu}"
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
                <div class="primaryFilters">
                    <slot name="primaryFilters" @slotchange=${this.handlePrimaryFilterChange}></slot>
                </div>
                <cc-line></cc-line>
                <div class="secondaryFilters">
                    <slot name="secondaryFilters"></slot>
                </div>
    
                <div class="user" @click="${() => {
                URLHandler.goToPage('/app/user')
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
                               @click="${this.openCreateRentMenu}"
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
                                    <p class="${value.id == URLHandler.getParam("type") ? 'selected' : ''}"
                                       @click="${() => {
                                           console.log(this.appState.value.editPage)
                                           URLHandler.setParam("type", value.id as string)
                                           this.appState.value.editPageType = value.id as DeviceTypeVariantEnum
                                       }}"
                                    >${value.name}</p>
                                `
                            })
                    }
                </cc-select>

                <div class="user" @click="${() => {
                    URLHandler.goToPage('/app/user')
                }}">
                    <img src="../../../assets/icon/user-icon-default.svg" alt="user">
                    <p>${(this.accountname)}</p>
                </div>
            `
        }
    }

    openCreateRentMenu(){
        this.appState.value.openCreateRentModal()
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
            }
        })
    }

    handlePrimaryFilterChange(){
        this.controlFilters.forEach((filter: FilterContainerComponent) => {
            filter.filterChange = () => {this.setSecondaryFilterVisibility()}
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-sidebar": SidebarComponent
    }
}
import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/sidebar.styles.scss'
import { ButtonComponent, ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {filter} from "rxjs"
import {SimpleColorEnum, SizeEnum, Tooltip} from "../../base"
import {model} from "../../index"
import {ObservedProperty} from "../../model"
import {AppState} from "../../AppState"
import URLHandler from "../../urlHandler"

@customElement('cc-sidebar')
export class SidebarComponent extends LitElement {
    @property({type:String})
    accountname?: string = 'No username provided'

    @queryAssignedElements({slot: "primaryFilters"})
    private primaryFilters!: Array<HTMLElement>;

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
        return html`
            <style>${styles}</style>
            <div class="buttons">
                <cc-button size="${SizeEnum.MEDIUM}" color="${SimpleColorEnum.ACCENT}" type="${ButtonType.FILLED}"
                           @click="${this.openCreateRentMenu}"
                           @mouseenter="${(e) => {
                               Tooltip.show(e.target, 'shift+n oder <', 1000)
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
                <slot name="sorts" @slotchange=${this.handlePrimaryFilterChange}></slot>
            </div>
            <cc-line></cc-line>
            <slot name="primaryFilters" @slotchange=${this.handlePrimaryFilterChange}></slot>
            <cc-line></cc-line>
            <div class="secondaryFilters">
                <slot name="secondaryFilters"></slot>
            </div>

            <div class="user" @click="${() => {URLHandler.setUrl('user')}}">
                <img src="../../../assets/icon/user-icon-default.svg" alt="user">
                <p>${(this.accountname)}</p>
            </div>
        `
    }

    openCreateRentMenu(){
        this.appState.value.openCreateRentModal()
    }

    setSecondaryFilterVisibility(){
        console.log("setSecondaryFilterVisibility")

        let selectedPrimaryFilters: (string | number)[] = []
        this.primaryFilters.forEach((filter: FilterContainerComponent) => {
            selectedPrimaryFilters = selectedPrimaryFilters.concat(filter.getSelectedOptionsAsIdArray())
        })

        console.log(selectedPrimaryFilters)

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
        this.primaryFilters.forEach((filter: FilterContainerComponent) => {
            filter.onUpdate = () => {this.setSecondaryFilterVisibility()}
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-sidebar": SidebarComponent
    }
}
import {LitElement, css, html} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/filterSidebar.styles.scss'
import {ButtonColor, ButtonComponent, ButtonType} from '../basic/button.component'
import {FilterContainerComponent} from "../basic/filterContainer.component"
import {filter} from "rxjs"
import {SizeEnum} from "../../base"

@customElement('cc-sidebar')
export class SidebarComponent extends LitElement {
    @property({type:String})
    accountname?: string = 'No username provided'

    @queryAssignedElements({slot: "primaryFilters"})
    primaryFilters!: Array<HTMLElement>;

    @queryAssignedElements({slot: "secondaryFilters"})
    secondaryFilters!: Array<HTMLElement>;

    constructor(username: string) {
        super()
        this.accountname = username
    }

    render() {
        return html`
            <style>${styles}</style>
            <div class="buttons">
                <cc-button size="${SizeEnum.MEDIUM}" color="${ButtonColor.ACCENT}" type="${ButtonType.FILLED}">
                    Neuer Verleih
                </cc-button>
                <cc-button size="${SizeEnum.MEDIUM}" color="${ButtonColor.ACCENT}" type="${ButtonType.OUTLINED}">
                    Multi Verleih
                </cc-button>
            </div>
            <cc-line></cc-line>
            <div class="sorts">
                <cc-select size="${SizeEnum.MEDIUM}">
                    <p class="selected">raster</p>
                    <p>liste</p>
                </cc-select>
                <cc-toggle>Nur verfügbare anzeigen</cc-toggle>
                <cc-button size="${SizeEnum.MEDIUM}" type="${ButtonType.UNDERLINED}" color="${ButtonColor.GRAY}">Filter zurücksetzten</cc-button>
            </div>
            <cc-line></cc-line>
            <slot name="primaryFilters" @slotchange=${this.handlePrimaryFilterChange}></slot>
            <cc-line></cc-line>
            <div class="secondaryFilters">
                <slot name="secondaryFilters"></slot>
            </div>

            <div class="user">
                <img src="../../../assets/user-icon-default.svg" alt="user">
                <p>${(this.accountname)}</p>
            </div>
        `
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
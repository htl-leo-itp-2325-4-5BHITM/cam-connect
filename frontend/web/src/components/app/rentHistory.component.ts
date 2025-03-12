import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/rentHistory.styles.scss'
import RentService, {Rent, RentStatusEnum} from "../../service/rent.service"
import {ColorEnum, SimpleColorEnum} from "../../base"
import Util from "../../util/Util"
import {ButtonType} from "../basic/button.component"
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {model} from "../../index"
import DeviceService from "../../service/device.service"
import DeviceTypeService from "../../service/deviceType.service"

interface chipProperty {
    color: ColorEnum
    text: string
}

@customElement('cc-rent-history')
export class RentHistoryComponent extends LitElement {
    @property()
    private mode: "student" | "device" = "student"

    @property()
    private identifier: string | number

    @property()
    private headerText: string = "unbekannt"

    @property()
    private rentList: Rent[] = null

    chipProperties: Map<RentStatusEnum, chipProperty>

    constructor() {
        super()
        this.chipProperties = new Map([
            [RentStatusEnum.RETURNED, {color: ColorEnum.ACCENT, text: "Zurückgegeben"}],
            [RentStatusEnum.WAITING, {color: ColorEnum.MID, text: "Warte auf Bestätigung"}],
            [RentStatusEnum.CONFIRMED, {color: ColorEnum.GOOD, text: "Bestätigt"}],
            [RentStatusEnum.DECLINED, {color: ColorEnum.BAD, text: "Abgelehnt"}],
            [RentStatusEnum.DELETED, {color: ColorEnum.GRAY, text: "Gelöscht"}],
        ])
    }

    connectedCallback() {
        super.connectedCallback();

        if(this.mode == "student") {
            RentService.allRentsByStudent(this.identifier as string).then(rentList => {
                this.rentList = rentList[0]?.rentList || []
                this.headerText = `${rentList[0]?.student?.firstname} ${rentList[0]?.student?.lastname}`
            })
        }else if(this.mode == "device") {
            DeviceService.associatedRents(this.identifier as number).then(rentList => {
                console.log(rentList)
                this.rentList = rentList || []
                this.headerText = `Gerät ${this.rentList[0]?.device.number || "unbekannt"}`
            })
        }
    }

    render() {
        if(this.rentList == null) {
            return html`
                <style>${styles}</style>
                <p class="noResults">Lade Verleiheinträge..</p>
            `
        }
        else if(this.rentList.length == 0){
            return html`
                <style>${styles}</style>
                <p class="noResults">Keine Verleiheinträge vorhanden</p>
            `
        }

        return html`
            <style>${styles}</style>
            
            <div class="header">
                <h2>Verleiheinträge von ${this.headerText}</h2>
                <cc-button 
                        type="${ButtonType.TEXT}" color="${ColorEnum.GRAY}" 
                        text="schließen"
                        @click="${() => model.appState.value.closeOverlay()}"
                >
                    <div slot="left" class="icon">${unsafeSVG(icon(faXmark).html[0])}</div>
                </cc-button>
            </div>
            
            <div class="rent-container">
                ${this.rentList?.map((rent:Rent, index) => html`
                    <div class="rent">
                        <div class="heading">
                            ${DeviceTypeService.deviceTypeToIcon(rent.device?.type.variant)}
                            <h3>${rent.device?.type.name}</h3>
                            <cc-chip color="${this.chipProperties.get(rent.status).color}" text="${this.chipProperties.get(rent.status)?.text}"></cc-chip>
                        </div>
                        <div class="row">
                            <cc-property-value property="Geräte Nr." value="${rent.device.number}"></cc-property-value>
                            <cc-property-value property="Erstellt am" value="${Util.formatDateTimeForHuman(rent.creation_date)}"></cc-property-value>
                            <cc-property-value property="Bearbeitet am" value="${Util.formatDateTimeForHuman(rent.change_date)}"></cc-property-value>
                        </div>
                        <h4>Ausleihung</h4>
                        <div class="row">
                            <cc-property-value property="Erstellt von" value="${rent.teacher_start?.firstname} ${rent.teacher_start?.lastname}"></cc-property-value>
                            <cc-property-value property="Datum" value="${Util.formatShortDateForHuman(rent.rent_start)}"></cc-property-value>
                        </div>
                        <h4>Rückgabe</h4>
                        <div class="row">
                            <cc-property-value property="Geplant" value="${Util.formatShortDateForHuman(rent.rent_end_planned)}"></cc-property-value>
                            ${ rent.status == RentStatusEnum.RETURNED ? html`
                                <cc-property-value property="Tatsächlich" value="${Util.formatShortDateForHuman(rent.rent_end_actual)}"></cc-property-value>
                                <cc-property-value property="Zurückgegeben von" value="${rent.teacher_end ? rent.teacher_end.firstname + ' ' + rent.teacher_end.lastname : 'unbekannt'}"></cc-property-value>
                            ` : html``}
                        </div>
                    </div>
                    
                    ${this.rentList[index+1] ? html`<cc-line></cc-line>` : ''}
                `)}
            </div>
            
            <div class="bottomBlur"></div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-rent-history": RentHistoryComponent
    }
}
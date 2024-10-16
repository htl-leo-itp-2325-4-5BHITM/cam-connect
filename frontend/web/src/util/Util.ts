import {DeviceTypeSource} from "../service/deviceType.service"
import {FilterOption} from "../components/basic/filterContainer.component"
import {DeviceTypeAttribute} from "../service/deviceTypeAttribute.service"
import AirDatepicker from "air-datepicker"
import localeDe from "air-datepicker/locale/de"
import {model} from "../index"
import {config} from "../base"
import {RentStatusEnum} from "../service/rent.service"
import {unsafeSVG} from 'lit/directives/unsafe-svg.js'
import {icon} from "@fortawesome/fontawesome-svg-core"
import {faCheck, faXmark, faQuestion} from "@fortawesome/free-solid-svg-icons"
import {html} from "lit"
import {Device, DeviceDTO} from "../service/device.service"

export default class Util{
    //TODO this typing does not seem right
    static deviceTypeToFilterOption(deviceTypes: DeviceTypeSource): FilterOption{
        return {
            name: deviceTypes.name,
            id: deviceTypes.type_id,
        }
    }

    /**
     * Intakes any deviceTypeAttribute (no matter which variation) and returns a FilterOption that can be used by
     * the filter-block-component
     * @param devicetypeAttribute
     */
    static deviceTypeAttributeToFilterOption(devicetypeAttribute: DeviceTypeAttribute): FilterOption{
        let extras = ("size" in devicetypeAttribute ? devicetypeAttribute.size : "")
            + ("resolution" in devicetypeAttribute ? devicetypeAttribute.resolution : "")

        return {
            name: devicetypeAttribute.name,
            details: devicetypeAttribute.details + " " + extras, //sorry if this space gets annoying at some point
            id: devicetypeAttribute.attribute_id,
        }
    }

    static deviceToDeviceDTO(device: Device): DeviceDTO{
        return {
            device_id: device.device_id,
            serial: device.serial,
            number: device.number,
            note: device.note,
            type_id: device.type.type_id,
            creation_date: device.creation_date,
            change_date: device.change_date,
            status: device.status
        }
    }

    /*static deviceTypeVariantToAutocompleteOption(deviceTypeVariant: DeviceTypeSource): AutocompleteOption{
        return {
            data: deviceTypeVariant,
            id: deviceTypeVariant.type_id,
        }
    }*/

    /**
     * should not be used in favour of event.composedPath()
     * @deprecated
     * @param startpoint
     */
    static deepEventFocusedElement(startpoint: HTMLElement = document.querySelector("cc-dashboard") as HTMLElement): HTMLElement{
        let focusedElem:HTMLElement = startpoint
        while (focusedElem != undefined) {
            let newFocusedElem = focusedElem?.shadowRoot?.activeElement as HTMLElement
            if(newFocusedElem == undefined) return focusedElem
            focusedElem = newFocusedElem
        }
        return focusedElem
    }

    static selectText(element: HTMLElement) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    static formatDateForDb(input: Date | string){
        let date: Date
        if(typeof input == "string"){
            date = new Date(input)
        }
        else{
            date = input
        }

        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    }

    static formatShortDateForHuman(input: Date | string){
        if(input == undefined) return "unbekannt"

        let date: Date
        if(typeof input == "string"){
            date = new Date(input)
        }
        else{
            date = input
        }

        return date.toLocaleDateString("at-DE", {day: "2-digit", month: "2-digit", year: "2-digit"})
    }

    static formatLongDateForHuman(input: Date | string){
        if(input == undefined) return null

        let date: Date
        if(typeof input == "string"){
            date = new Date(input)
        }
        else{
            date = input
        }

        return date.toLocaleDateString("at-DE", {day: "2-digit", month: "2-digit", year: "numeric"})
    }

    static formatDateTimeForHuman(input: Date | string){
        if(input == undefined) return "unbekannt"

        let date: Date
        if(typeof input == "string"){
            date = new Date(input)
        }
        else{
            date = input
        }

        return date.toLocaleDateString("at-DE", {day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit"})
    }

    static currentFullDate(){
        const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}_${String(new Date().getHours()).padStart(2, '0')}-${String(new Date().getMinutes()).padStart(2, '0')}-${String(new Date().getSeconds()).padStart(2, '0')}`;
        return formattedDate
    }

    static smartHeight(elem: HTMLElement){
        let styles = getComputedStyle(elem)
        if(styles.boxSizing == "border-box"){
            return elem.clientHeight
        }
        else{
            return elem.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom)
        }
    }

    static rentStatusToHuman(status: RentStatusEnum){
        switch (status) {
            case RentStatusEnum.CONFIRMED:
                return "Bestätigt"
            case RentStatusEnum.RETURNED:
                return "Zurückgegeben"
            case RentStatusEnum.DECLINED:
                return "Abgelehnt"
            case RentStatusEnum.WAITING:
                return "Ausstehend"
            case RentStatusEnum.CREATED:
                return "Erstellt"
            default:
                return "Unbekannt"

        }
    }

    static rentStatusToIcon(status: RentStatusEnum){
        switch (status) {
            case RentStatusEnum.CONFIRMED:
                return html`${unsafeSVG(icon(faCheck).html[0])}`
            case RentStatusEnum.RETURNED:
                return html`<img src="../../assets/icon/custom/return.svg" alt="<-">`
            case RentStatusEnum.DECLINED:
                return html`${unsafeSVG(icon(faXmark).html[0])}`
            case RentStatusEnum.WAITING:
                return html`${unsafeSVG(icon(faQuestion).html[0])}`
            case RentStatusEnum.CREATED:
                return html``
        }
    }

    static debounce(func, timeout = 300){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    static boolToYesNo(bool: boolean){
        return bool ? "Ja" : "Nein"
    }

    static parseJwt (token: string) {
        let base64Url = token.split('.')[1];
        if(!base64Url) return {}
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}

export class AnimationHelper{
    static shake(elem: Element, duration: number = 200){
        elem.animate([
            {transform: 'translateX(0)', rotate: '0deg'},
            {transform: 'translateX(-5px)', rotate: '-2deg'},
            {transform: 'translateX(5px)', rotate: '0deg'},
            {transform: 'translateX(-5px)', rotate: '2deg'},
            {transform: 'translateX(5px)', rotate: '0deg'},
            {transform: 'translateX(-5px)', rotate: '-2deg'},
            {transform: 'translateX(0)', rotate: '0deg'},
        ], {
            duration: duration,
            easing: 'ease-in-out',
        })
    }

    static pop(elem: Element, duration: number = 200, scale: number = 1.05){
        elem.animate([
            {transform: 'scale(1)'},
            {transform: `scale(${scale})`},
            {transform: 'scale(1)'},
        ], {
            duration: duration,
            easing: 'ease-in-out',
        })
    }

    static bounce(elem: Element, duration: number = 200){
        elem.animate([

        ], {
            duration: duration,
            easing: 'ease-in-out',
        })
    }

    static spin(elem: Element, duration: number = 400){
        elem.animate([
            {rotate: '0deg'},
            {rotate: '720deg'},
        ], {
            duration: duration,
            easing: 'ease-in-out',
        })
    }

    static remove(elem: Element, duration: number = 200){
        let elemAsHTMLElement = elem as HTMLElement
        elemAsHTMLElement.style.overflow = "hidden"

        elem.animate([
            {opacity: 1, height: Util.smartHeight(elemAsHTMLElement) + "px"},
            {opacity: 0, height: "0px"},
        ], {
            duration: duration,
            easing: 'ease-in-out',
        })

        setTimeout(() => {
            elem.remove()
        },duration)
    }

    static show(elem: Element, display: string = "block", duration: number = 200){
        let elemAsHTMLElement = elem as HTMLElement

        if(elemAsHTMLElement.dataset.visibility == "visible") return

        elemAsHTMLElement.dataset.visibility = "showing"

        elemAsHTMLElement.style.opacity = "0"
        elemAsHTMLElement.style.display = display

        setTimeout(() => {
            elem.animate([
                {opacity: 0, transform: "translateY(5px)"},
                {opacity: 1, transform: "translateY(0)"},
            ], {
                duration: duration,
                easing: 'ease-in-out',
                fill: "forwards",
            })
        },)
        setTimeout(() => {
            elemAsHTMLElement.style.opacity = "1"
            elemAsHTMLElement.style.display = display
            elemAsHTMLElement.dataset.visibility = "visible"
        },duration)
    }

    static hide(elem: Element, duration: number = 200){
        let elemAsHTMLElement = elem as HTMLElement

        if(elemAsHTMLElement.dataset.visibility == "hidden") return

        elemAsHTMLElement.dataset.visibility = "hiding"

        elem.animate([
            {opacity: 1, transform: "translateY(0)"},
            {opacity: 0, transform: "translateY(5px)"},
        ], {
            duration: duration,
            easing: 'ease-in-out',
            fill: "forwards",
        })


        setTimeout(() => {
            if(elemAsHTMLElement.dataset.visibility == "hiding") {
                elemAsHTMLElement.style.display = "none"
                elemAsHTMLElement.dataset.visibility = "hidden"
            }
        },duration)
    }
}

/**
 * Simple wrapper class for console.log with the main improvement being that it can be turned off per instance
 */
export class Logger{
    doLogs: boolean = true
    name: string = undefined
    constructor(doLogs: boolean = true, name: string = undefined) {
        this.doLogs = doLogs
        this.name = name
    }

    log(...args: any[]){
        if(this.doLogs && config.do_logs){
            if(this.name)
                console.log(this.name + ":", ...args)
            else
                console.log(...args)
        }
    }
}

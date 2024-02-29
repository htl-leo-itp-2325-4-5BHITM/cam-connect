import {DeviceTypeSource} from "./service/deviceType.service"
import {FilterOption} from "./components/basic/filterContainer.component"
import {DeviceTypeAttribute} from "./service/deviceTypeAttribute.service"
import * as repl from "repl"
import {AutocompleteOption} from "./components/basic/autocomplete.component"
import AirDatepicker from "air-datepicker"
import localeDe from "air-datepicker/locale/de"
import {model} from "./index"
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

    /*static deviceTypeVariantToAutocompleteOption(deviceTypeVariant: DeviceTypeSource): AutocompleteOption{
        return {
            data: deviceTypeVariant,
            id: deviceTypeVariant.type_id,
        }
    }*/

    static deepEventTarget(startpoint: Element = document.activeElement){
        let focusedElem = startpoint
        while (focusedElem != undefined) {
            let newFocusedElem = focusedElem?.shadowRoot?.activeElement
            if(newFocusedElem == undefined) return focusedElem
            focusedElem = newFocusedElem
        }
    }

    //TODO constrain the generic so that it has to have a properly named id column, something like: extends {[keyName]:(number | string)}
    static replaceItemByIdInJsonArray<T>(data: T[], replacement: T, id: (number | string), keyName: keyof T):T[] {
        for (let i = 0; i < data.length; i++) {
            if(data[i][keyName] === id){
                data[i] = replacement
                return data
            }
        }
        return data
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

    static formatDateForHuman(input: Date | string){
        let date: Date
        if(typeof input == "string"){
            date = new Date(input)
        }
        else{
            date = input
        }

        return date.toLocaleDateString("at-DE", {day: "2-digit", month: "2-digit", year: "2-digit"})
    }
}

//TODO ask huemer if we want to allow dates in the past
//there might be a case where someone wants to log a rent that they conducted in the past
//it probably makes most sense to only allow ones in the future
//airpicker does allow to set a min date
//TODO the color of the keyboard nav effect is always the same and not visible inside a date range
//this is not a problem with out implementation but with the library, its the same in the examples
export class DatePickerWrapper{
    instance: AirDatepicker
    lastSelection = [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
    static pickerIsOpen = false

    constructor(input: HTMLInputElement, onSelect?: ({date, formattedDate, datepicker}) => void) {
        this.instance = new AirDatepicker(input, {
            locale: localeDe,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)],
            autoClose: true,
            moveToOtherMonthsOnSelect: false,
            toggleSelected: false,
            onShow: (finished) => {
                if(finished) return //onShow gets called twice, once on animation start and a second time on animation end
                DatePickerWrapper.pickerIsOpen = true
                //the datepicker handles its own close by esc, to prevent another close action from getting called this
                // dummy is added
                model.appState.value.addCurrentActionCancellation(()=>{}, "datepicker")
            },
            onHide: (finished) => {
                if(finished) return //onHide gets called twice, once on animation start and a second time on animation end
                DatePickerWrapper.pickerIsOpen = false
                if(this.instance.selectedDates.length == 1){//prevents only one date from being selected
                    this.instance.clear()
                    this.instance.selectDate([this.lastSelection[0], this.lastSelection[1]])
                }
                else{
                    this.lastSelection = this.instance.selectedDates
                }
                setTimeout(() => {
                    if(!DatePickerWrapper.pickerIsOpen)
                        model.appState.value.removeCurrentActionCancellation("datepicker")
                },100)
            },
            onSelect:() => {
                //console.log(this.instance.selectedDates)
            }
        })
    }
}
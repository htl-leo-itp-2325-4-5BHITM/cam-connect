import Util from "./util/Util"
import {model} from "./index"
import AirDatepicker from "air-datepicker"
import localeDe from "air-datepicker/locale/de"
import PopupEngine from "./util/PopupEngine"

export const config = {
    api_url: "http://localhost:8080/api",
    socket_url: "ws://localhost:8080/api",
    do_logs: true,
}

export const Regex = {
    anyThingButNumbers: /\D/,
    empty: /^\s*$/,
    onlySpecialChars: /^[^a-zA-Z0-9]*$/,
    onlyNumbersOrLetters: /^[a-zA-Z0-9]*$/,
}

export interface ccResponse<T>{
    ccStatus: ccStatus
    details: {
        time: string
        dataType: string
    }
    data: T
}

export interface ccStatus{
    statusCode: number
    details: string
    message: string
}

export enum ColorEnum {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
export enum SimpleColorEnum {ACCENT="accent", GRAY="gray"}
export enum SizeEnum {BIG="big", MEDIUM="medium", SMALL="small"}
export enum Orientation {HORIZONTAL="horizontal", VERTICAL="vertical"}

export interface SimpleOption<ID, DATA> {
    id: ID
    data: DATA
}

interface ResizeBreakpoint {
    size: number,
    key: string
}
export class WidthResizeObserver {
    source: HTMLElement
    breakpoints: ResizeBreakpoint[]
    lastWidth: number
    constructor(source: HTMLElement, breakpoints: ResizeBreakpoint[]) {
        this.source = source
        this.breakpoints = breakpoints.sort((a, b) => a.size - b.size)

        new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                if(Math.abs(this.lastWidth - this.source.clientWidth) < 10) return
                this.lastWidth = this.source.clientWidth

                let newSize = this.breakpoints.at(-1).key;

                for (let i = 0; i < this.breakpoints.length; i++) {
                    const breakpoint = this.breakpoints[i];
                    if (this.source.clientWidth > breakpoint.size && this.source.clientWidth < this.breakpoints[i + 1]?.size) {
                        newSize = breakpoint.key;
                        break;
                    }
                }

                if (this.source.getAttribute("size") !== newSize) {
                    this.source.setAttribute("size", newSize); // Update size attribute only if it has changed
                }
            })
        }).observe(this.source)
    }
}


//TODO the color of the keyboard nav effect is always the same and not visible inside a date range
//this is not a problem with out implementation but with the library, its the same in the examples
export class DatePickerWrapper{
    instance: AirDatepicker
    lastSelection = [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
    static pickerIsOpen = false

    constructor(input: HTMLInputElement, selectedDates = [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)], onSelect = (dates: Date[]) => {}){
        this.instance = new AirDatepicker(input, {
            locale: localeDe,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: selectedDates,
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
                    onSelect(this.instance.selectedDates)
                }
                setTimeout(() => {
                    if(!DatePickerWrapper.pickerIsOpen)
                        model.appState.value.removeCurrentActionCancellation("datepicker")
                },100)
            }
        })
    }
}

